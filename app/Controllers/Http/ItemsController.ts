import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {bind} from '@adonisjs/route-model-binding'
import Item from "App/Models/Item"
import StoreItemValidator from "App/Validators/StoreItemValidator"
import UpdateItemValidator from "App/Validators/UpdateItemValidator"
import Application from "@ioc:Adonis/Core/Application"

export default class ItemsController {
  public async index({request, response}: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 50

    const items = await Item.query().orderBy('id').paginate(page, limit)
    return response.status(200).json(items.queryString(request.qs()))
  }

  public async store({request, response}: HttpContextContract) {
    const payload = await request.validate(StoreItemValidator)
    const data = await this.extracted(payload)

    const item = await Item.create(data)
    return response.status(200).json(item)
  }

  @bind()
  public async show({response}: HttpContextContract, item: Item) {
    return response.status(200).json(item)
  }

  @bind()
  public async update({request, response}: HttpContextContract, item: Item) {
    const payload = await request.validate(UpdateItemValidator)
    const data = await this.extracted(payload)
    await item.merge(data).save()

    return response.status(200).json({
      message: "Barang berhasil diubah",
      data: item
    })
  }

  @bind()
  public async destroy({response}: HttpContextContract, item: Item) {
    await item.delete()
    return response.status(200).json({message: 'Barang berhasil dihapus.'})
  }

  private async extracted(payload: any) {
    let data = {}

    if (payload.image) {
      const imageName = new Date().getTime().toString() + '-' + payload.image.clientName
      await payload.image.move(Application.publicPath('img/items'), {
        name: imageName,
      })

      data = {
        ...payload,
        image: `items/${imageName}`,
      }
    } else {
      data = payload
    }

    return data
  }
}
