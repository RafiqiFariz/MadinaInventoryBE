import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { bind } from '@adonisjs/route-model-binding'
import Transaction from "App/Models/Transaction"
import TransactionValidator from "App/Validators/TransactionValidator"
import Item from "App/Models/Item"
import Database from '@ioc:Adonis/Lucid/Database'

export default class TransactionsController {
  public async index({request, response}: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 25)

    const sort = request.input('sort', 'asc')
    const paymentMethod = request.input('payment_method', '')
    const type = request.input('type', '')
    const date = request.input('date', '')
    const includeUser = request.input('include_user', 0)

    const query =
      Transaction.query()
        .preload('details')

    if (+(includeUser) === 1) {
      query.preload('user')
    }

    if (paymentMethod) {
      query.where('payment_method', paymentMethod)
    }

    if (type) {
      query.whereHas('details', (query) => {
        query.where('type', type)
      })
    }

    if (date) {
      query.where('created_at', date)
    }

    query.orderBy('id', sort)

    const transactions = await query.paginate(page, limit)
    return response.status(200).json(transactions.queryString(request.qs()))
  }

  public async store({request, response, auth}: HttpContextContract) {
    const payload = await request.validate(TransactionValidator)

    await Database.transaction(async (trx) => {
      request.updateBody({
        ...request.body(),
        employee_id: auth.user?.id
      })

      const transaction = await Transaction.create(request.except(['items']), {client: trx})

      const details: any = [];

      for (const item of payload.items) {
        const itemDB = await Item.findOrFail(item.id, {client: trx})
        const stock = itemDB.stock + item.qty

        if (stock < 0) {
          await trx.rollback()
          return response.status(400).json({
            message: `Stok ${itemDB.name} tidak mencukupi`
          })
        }

        await itemDB.merge({stock}).save()

        details.push({
          transaction_id: transaction.id,
          item_id: item.id,
          qty: item.qty,
          type: item.qty > 0 ? 'in' : 'out',
          total_price: itemDB.price * Math.abs(item.qty)
        })
      }

      await transaction.related('details').createMany(details)
      const totalPrice = details.reduce((acc: number, curr: any) => acc + +(curr.total_price), 0)
      const remainingPayment = totalPrice - request.input('down_payment', 0);
      await transaction.merge({
        total_price: totalPrice,
        remaining_payment: remainingPayment,
      }).save()

      return response.status(200).json(transaction)
    })
  }

  @bind()
  public async show({response}: HttpContextContract, transaction: Transaction) {
    await transaction.load((loader) => {
      loader.load('details').load('user')
    })

    return response.status(200).json(transaction)
  }

  @bind()
  public async update({request, response, bouncer}: HttpContextContract, transaction: Transaction) {
    await bouncer
      .with('TransactionPolicy')
      .authorize('update')

    const payload = await request.validate(TransactionValidator)
    const trx = await Database.transaction()

    transaction.useTransaction(trx)

    try {
      await transaction.merge(request.except(['items'])).save()

      await this.destroyDetailIfItemNotExists(transaction, payload)

      for (const item of payload.items) {
        // pastikan item yang diinput ada di database
        const itemDB = await Item.find(item.id, {client: trx})

        if (!itemDB) continue

        let detail =
          await transaction.related('details')
            .query()
            .where('item_id', item.id)
            .first()

        if (!detail) {
          detail = await transaction.related('details').create({
            itemId: item.id,
            qty: item.qty,
            type: item.qty > 0 ? 'in' : 'out',
            total_price: itemDB.price * Math.abs(item.qty)
          })
        }

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

        // jika stock kurang dari 0, maka rollback
        if (stock < 0) {
          await trx.rollback()
          return response.status(400).json({
            message: `Stok ${itemDB.name} tidak mencukupi`
          })
        }

        await detail.merge({
          qty: item.qty,
          type: item.qty > 0 ? 'in' : 'out',
          total_price: itemDB.price * Math.abs(item.qty)
        }).save()

        await itemDB.merge({stock}).save()

        const details = await transaction.related('details').query()
        const totalPrice = details.reduce((acc: number, curr: any) => acc + +(curr.total_price), 0)
        const remainingPayment = totalPrice - request.input('down_payment', 0);
        await transaction.merge({
          total_price: totalPrice,
          remaining_payment: remainingPayment
        }).save()
      }

      await trx.commit()

      return response.status(200).json({
        message: "Transaksi berhasil diubah",
        data: transaction
      })
    } catch (error) {
      console.log(error)
      await trx.rollback()
    }
  }

  @bind()
  public async destroy({response, bouncer}: HttpContextContract, transaction: Transaction) {
    await bouncer
      .with('TransactionPolicy')
      .authorize('delete')

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

  private async destroyDetailIfItemNotExists(transaction: Transaction, payload: any) {
    // Ambil semua detail transaksi yang saat ini ada dalam database
    const existingDetails = await transaction.related('details').query().select('id', 'item_id')

    for (const existingDetail of existingDetails) {
      const itemInPayload = payload.items.find(item => item.id === existingDetail.itemId)

      // Jika item detail tidak ada dalam payload, maka hapus detail tersebut
      if (!itemInPayload) {
        const detail = await transaction.related('details').query().where('id', existingDetail.id).firstOrFail()
        const detailItem = await Item.findOrFail(detail.itemId)
        await detailItem.merge({stock: detailItem.stock - detail.qty}).save()
        await detail.delete()
      }
    }
  }
}
