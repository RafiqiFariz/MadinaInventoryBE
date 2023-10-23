import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {bind} from '@adonisjs/route-model-binding'
import Brand from "App/Models/Brand"
import BrandValidator from "App/Validators/BrandValidator"

export default class BrandsController {
  public async index({request, response}: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 25

    const brands = await Brand.query().paginate(page, limit)
    return response.status(200).json(brands.queryString(request.qs()))
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
