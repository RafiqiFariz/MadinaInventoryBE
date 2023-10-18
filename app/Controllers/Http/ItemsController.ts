import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Item from "App/Models/Item";
import ItemValidator from "App/Validators/ItemValidator";
import Application from "@ioc:Adonis/Core/Application";
import {RequestContract} from '@ioc:Adonis/Core/Request';

export default class ItemsController {
  public async index({response}: HttpContextContract) {
    const items = await Item.all()
    response.status(200).json(items)
  }

  public async store({request, response}: HttpContextContract) {
    const data = await this.extracted(request);

    const item = await Item.create(data)
    response.status(200).json(item)
  }

  public async show({response}: HttpContextContract, item: Item) {
    response.status(200).json(item)
  }

  public async update({request, response}: HttpContextContract, item: Item) {
    const data = await this.extracted(request);

    item.merge(data)
    await item.save()
    response.status(200).json(item)
  }

  public async destroy({response}: HttpContextContract, item: Item) {
    await item.delete()
    response.status(200).json({message: 'Item berhasil dihapus.'})
  }

  private async extracted(request: RequestContract) {
    const payload = await request.validate(ItemValidator)

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
      delete payload.image
      data = payload
    }

    return data
  }
}
