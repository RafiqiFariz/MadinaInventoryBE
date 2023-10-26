import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {bind} from '@adonisjs/route-model-binding'
import ItemType from "App/Models/ItemType"
import ItemTypeValidator from "App/Validators/ItemTypeValidator"


export default class ItemTypesController {
  public async index({response}: HttpContextContract) {
    const itemTypes = await ItemType.all()
    return response.status(200).json(itemTypes)
  }

  public async store({request, response}: HttpContextContract) {
    const payload = await request.validate(ItemTypeValidator)
    const itemType = await ItemType.create(payload)
    return response.status(200).json(itemType)
  }

  @bind()
  public async show({response}: HttpContextContract, itemType: ItemType) {
    return response.status(200).json(itemType)
  }

  @bind()
  public async update({request, response}: HttpContextContract, itemType: ItemType) {
    const payload = await request.validate(ItemTypeValidator)
    await itemType.merge(payload).save()

    return response.status(200).json({
      message: "Tipe barang berhasil diubah",
      data: itemType
    })
  }

  @bind()
  public async destroy({response}: HttpContextContract, itemType: ItemType) {
    await itemType.delete()

    return response.status(200).json({message: "Tipe barang berhasil dihapus"})
  }
}
