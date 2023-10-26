import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {bind} from '@adonisjs/route-model-binding'
import Transaction from "App/Models/Transaction"
import TransactionValidator from "App/Validators/TransactionValidator"
import Item from "App/Models/Item"
import Database from '@ioc:Adonis/Lucid/Database'

export default class TransactionsController {
  public async index({request, response}: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 25

    const transactions = await Transaction.query().paginate(page, limit)
    return response.status(200).json(transactions.queryString(request.qs()))
  }

  public async store({request, response, auth}: HttpContextContract) {
    const payload = await request.validate(TransactionValidator)

    await Database.transaction(async (trx) => {
      request.updateBody({
        ...request.body(),
        user_id: auth.user?.id
      })

      const transaction = await Transaction.create(request.except(['items']), {client: trx})

      const details: any = [];

      for (const item of payload.items) {
        details.push({
          transaction_id: transaction.id,
          item_id: item.id,
          qty: item.qty,
          type: item.qty > 0 ? 'in' : 'out'
        })

        const itemDB = await Item.findOrFail(item.id, {client: trx})
        const stock = itemDB.stock + item.qty
        await itemDB.merge({stock}).save()
      }

      await transaction.related('details').createMany(details)

      return response.status(200).json(transaction)
    })
  }

  @bind()
  public async show({response}: HttpContextContract, transaction: Transaction) {
    return response.status(200).json(transaction)
  }

  @bind()
  public async update({request, response}: HttpContextContract, transaction: Transaction) {
    const payload = await request.validate(TransactionValidator)
    const trx = await Database.transaction()

    transaction.useTransaction(trx)

    try {
      await transaction.merge(request.except(['items'])).save()
      const details: any = [];

      for (const item of payload.items) {
        details.push({
          itemId: item.id,
          qty: item.qty,
          type: item.qty > 0 ? 'in' : 'out'
        })

        const itemDB = await Item.find(item.id, {client: trx})

        if (!itemDB) continue

        const detail =
          await transaction.related('details')
            .query()
            .where('item_id', item.id)
            .firstOrFail()

        // cek apakah ada perubahan qty
        let stock = 0

        // jika qty yang diinput lebih besar dari qty yang tersimpan di database
        // maka stock akan bertambah
        if (item.qty > detail.qty) {
          stock = itemDB.stock + (item.qty - detail.qty)
          // jika qty yang diinput lebih kecil dari qty yang tersimpan di database
          // maka stock akan berkurang
        } else if (item.qty < detail.qty) {
          stock = itemDB.stock - (detail.qty - item.qty)
          // jika qty yang diinput sama dengan qty yang tersimpan di database
          // maka stock tidak berubah
        } else if (item.qty === detail.qty) {
          stock = itemDB.stock
        }

        await itemDB.merge({stock}).save()
      }

      await transaction.related('details').updateOrCreateMany(details, 'itemId')

      await trx.commit()

      return response.status(200).json({
        message: "Transaksi berhasil diubah",
        data: transaction
      })
    } catch (error) {
      await trx.rollback()
    }
  }

  @bind()
  public async destroy({response}: HttpContextContract, transaction: Transaction) {
    // Kembalikan stock barang
    const details = await transaction.related('details').query()
    for (const detail of details) {
      const item = await Item.find(detail.itemId)
      if (!item) continue
      const stock = item.stock - detail.qty
      await item.merge({stock}).save()
    }

    await transaction.delete()

    return response.status(200).json({message: "Transaksi berhasil dihapus"})
  }
}
