import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {bind} from '@adonisjs/route-model-binding'
import Transaction from "App/Models/Transaction"
import TransactionValidator from "App/Validators/TransactionValidator"

export default class TransactionsController {
  public async index({response}: HttpContextContract) {
    const transactions = await Transaction.all()
    response.status(200).json(transactions)
  }

  public async store({request, response}: HttpContextContract) {
    const payload = await request.validate(TransactionValidator)
    const transaction = await Transaction.create(payload)
    response.status(200).json(transaction)
  }

  @bind()
  public async show({response}: HttpContextContract, transaction: Transaction) {
    response.status(200).json(transaction)
  }

  @bind()
  public async update({request, response}: HttpContextContract, transaction: Transaction) {
    const payload = await request.validate(TransactionValidator)
    await transaction.merge(payload).save()

    response.status(200).json({
      message: "Transaksi berhasil diubah",
      data: transaction
    })
  }

  @bind()
  public async destroy({response}: HttpContextContract, transaction: Transaction) {
    await transaction.delete()

    response.status(200).json({message: "Transaksi berhasil dihapus"})
  }
}
