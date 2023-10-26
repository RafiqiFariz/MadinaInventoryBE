import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {bind} from '@adonisjs/route-model-binding'
import User from "App/Models/User"
import StoreUserValidator from "App/Validators/StoreUserValidator"
import UpdateUserValidator from "App/Validators/UpdateUserValidator"

export default class UsersController {
  public async index({request, response}: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 25

    const users = await User.query().paginate(page, limit)
    return response.status(200).json(users.queryString(request.qs()))
  }

  public async store({request, response}: HttpContextContract) {
    const payload = await request.validate(StoreUserValidator)
    payload['role_id'] = payload['role_id'] ?? 2 // karyawan
    const user = await User.create(payload)
    return response.status(200).json(user)
  }

  @bind()
  public async show({response}: HttpContextContract, user: User) {
    return response.status(200).json(user)
  }

  @bind()
  public async update({request, response}: HttpContextContract, user: User) {
    const payload = await request.validate(UpdateUserValidator)
    await user.merge(payload).save()

    return response.status(200).json({
      message: "User berhasil diubah",
      data: user
    })
  }

  @bind()
  public async destroy({response}: HttpContextContract, user: User) {
    await user.delete()

    return response.status(200).json({message: "User berhasil dihapus"})
  }
}
