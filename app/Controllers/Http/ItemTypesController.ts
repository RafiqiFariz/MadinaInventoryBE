import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ItemType from "App/Models/ItemType";
import ItemTypeValidator from "App/Validators/ItemTypeValidator";

export default class ItemTypesController {
  public async index({response}: HttpContextContract) {
    const itemTypes = await ItemType.all()
    response.status(200).json(itemTypes)
  }

  public async store({request, response}: HttpContextContract) {
    const payload = await request.validate(ItemTypeValidator)
    const itemType = await ItemType.create(payload)
    response.status(200).json(itemType)
  }

  public async show({response}: HttpContextContract, itemType: ItemType) {
    response.status(200).json(itemType)
  }

  public async update({request, response}: HttpContextContract, itemType: ItemType) {
    const payload = await request.validate(ItemTypeValidator)
    await itemType.merge(payload).save()

    response.status(200).json({
      message: "Tipe barang berhasil diubah",
      data: itemType
    })
  }

  public async destroy({response}: HttpContextContract, itemType: ItemType) {
    await itemType.delete()

    response.status(200).json({message: "Tipe barang berhasil dihapus"})
  }
}
