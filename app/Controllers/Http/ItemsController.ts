import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { bind } from '@adonisjs/route-model-binding'
import Item from "App/Models/Item"
import StoreItemValidator from "App/Validators/StoreItemValidator"
import UpdateItemValidator from "App/Validators/UpdateItemValidator"
import Application from "@ioc:Adonis/Core/Application"

export default class ItemsController {
  public async index({request, response}: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)

    const brands = request.input('brands', '')
    const types = request.input('types', '')
    const sort = request.input('sort', 'asc')

    const query = Item.query().preload('brand').preload('type').where('is_active', true)

    if (brands) {
      query.whereIn('brand_id', brands.split(','))
    }

    if (types) {
      query.whereIn('item_type_id', types.split(','))
    }

    query.orderBy('id', sort)

    const items = await query.paginate(page, limit)
    return response.status(200).json(items.queryString(request.qs()))
  }

  public async store({request, response, bouncer}: HttpContextContract) {
    await bouncer
      .with('ItemPolicy')
      .authorize('create')

    const payload = await request.validate(StoreItemValidator)
    const data = await this.extracted(payload)

    const item = await Item.create(data)
    return response.status(200).json(item)
  }

  @bind()
  public async show({response}: HttpContextContract, item: Item) {
    await item.load((loader) => {
      loader.load('brand').load('type')
    })

    return response.status(200).json(item)
  }

  @bind()
  public async update({request, response, bouncer}: HttpContextContract, item: Item) {
    await bouncer
      .with('ItemPolicy')
      .authorize('update')

    const payload = await request.validate(UpdateItemValidator)
    const data = await this.extracted(payload)
    await item.merge(data).save()

    return response.status(200).json({
      data: item,
      message: "Barang berhasil diubah",
    })
  }

  @bind()
  public async destroy({response, bouncer}: HttpContextContract, item: Item) {
    await bouncer
      .with('ItemPolicy')
      .authorize('delete')

    const details = await item.related('details').query()

    if (details.length > 0) {
      return response.status(409).json({
        success: false,
        message: `Barang ${item.id} tidak dapat dihapus karena sudah digunakan.`
      })
    }

    await item.delete()
    return response.status(200).json({
      success: true,
      message: `Barang ${item.id} berhasil dihapus.`
    })
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
