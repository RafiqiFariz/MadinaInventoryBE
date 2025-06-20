import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import TransactionDetail from "App/Models/TransactionDetail"
import {bind} from "@adonisjs/route-model-binding"
import TransactionDetailValidator from "App/Validators/TransactionDetailValidator"

export default class TransactionDetailsController {
  public async index({response, request}: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 25

    const details = await TransactionDetail.query().paginate(page, limit)
    return response.status(200).json(details.queryString(request.qs()))
  }

  public async store({request, response}: HttpContextContract) {
    const payload = await request.validate(TransactionDetailValidator)
    const detail = await TransactionDetail.create(payload)
    return response.status(200).json(detail)
  }

  @bind()
  public async show({response}: HttpContextContract, detail: TransactionDetail) {
    return response.status(200).json(detail)
  }

  @bind()
  public async update({request, response, bouncer}: HttpContextContract, detail: TransactionDetail) {
    await bouncer
      .with('TransactionDetailPolicy')
      .authorize('update')

    const payload = await request.validate(TransactionDetailValidator)
    await detail.merge(payload).save()

    return response.status(200).json({
      message: "Detail transaksi berhasil diubah",
      data: detail
    })
  }

  public async destroy({response, bouncer}: HttpContextContract, detail: TransactionDetail) {
    await bouncer
      .with('TransactionDetailPolicy')
      .authorize('delete')

    await detail.delete()
    return response.status(200).json({message: "Detail transaksi berhasil dihapus"})
  }
}
