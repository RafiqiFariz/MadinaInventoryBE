import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {bind} from '@adonisjs/route-model-binding'
import ItemType from "App/Models/ItemType"
import ItemTypeValidator from "App/Validators/ItemTypeValidator"


export default class ItemTypesController {
  public async index({response}: HttpContextContract) {
    const itemTypes = await ItemType.all()
    return response.status(200).json(itemTypes)
  }

  public async store({request, response, bouncer}: HttpContextContract) {
    await bouncer
      .with('ItemTypePolicy')
      .authorize('create')

    const payload = await request.validate(ItemTypeValidator)
    const itemType = await ItemType.create(payload)
    return response.status(200).json(itemType)
  }

  @bind()
  public async show({response}: HttpContextContract, itemType: ItemType) {
    return response.status(200).json(itemType)
  }

  @bind()
  public async update({request, response, bouncer}: HttpContextContract, itemType: ItemType) {
    await bouncer
      .with('ItemTypePolicy')
      .authorize('update')

    const payload = await request.validate(ItemTypeValidator)
    await itemType.merge(payload).save()

    return response.status(200).json({
      message: "Tipe barang berhasil diubah",
      data: itemType
    })
  }

  @bind()
  public async destroy({response, bouncer}: HttpContextContract, itemType: ItemType) {
    await bouncer
      .with('ItemTypePolicy')
      .authorize('delete')

    const items = await itemType.related('items').query()

    if (items.length > 0) {
      return response.status(409).json({
        message: "Tipe barang tidak dapat dihapus karena masih memiliki barang."
      })
    }

    await itemType.delete()

    return response.status(200).json({message: "Tipe barang berhasil dihapus"})
  }
}
