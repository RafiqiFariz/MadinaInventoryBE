import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {bind} from '@adonisjs/route-model-binding'
import Brand from "App/Models/Brand"
import BrandValidator from "App/Validators/BrandValidator"

export default class BrandsController {
  public async index({response}: HttpContextContract) {
    const brands = await Brand.all()
    return response.status(200).json(brands)
  }

  public async store({request, response}: HttpContextContract) {
    const payload = await request.validate(BrandValidator)
    const brand = await Brand.create(payload)
    return response.status(200).json(brand)
  }

  @bind()
  public async show({response}: HttpContextContract, brand: Brand) {
    return response.status(200).json(brand)
  }

  @bind()
  public async update({request, response}: HttpContextContract, brand: Brand) {
    const payload = await request.validate(BrandValidator)
    await brand.merge(payload).save()

    return response.status(200).json({
      message: "Brand berhasil diubah",
      data: brand
    })
  }

  @bind()
  public async destroy({response}: HttpContextContract, brand: Brand) {
    await brand.delete()

    return response.status(200).json({message: "Brand berhasil dihapus"})
  }
}
