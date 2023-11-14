import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {bind} from '@adonisjs/route-model-binding'
import User from "App/Models/User"
import StoreUserValidator from "App/Validators/StoreUserValidator"
import UpdateUserValidator from "App/Validators/UpdateUserValidator"
import Hash from "@ioc:Adonis/Core/Hash";

export default class UsersController {
  public async index({request, response, bouncer}: HttpContextContract) {
    await bouncer
      .with('UserPolicy')
      .authorize('viewList')

    const page = request.input('page', 1)
    const limit = 25

    const users = await User.query().preload('role').paginate(page, limit)
    return response.status(200).json(users.queryString(request.qs()))
  }

  public async store({request, response, bouncer}: HttpContextContract) {
    await bouncer
      .with('UserPolicy')
      .authorize('create')

    const payload = await request.validate(StoreUserValidator)
    payload['role_id'] = payload['role_id'] ?? 3 // customer
    payload['password'] = await Hash.make(payload['password'])

    const user = await User.create(payload)
    return response.status(200).json(user)
  }

  @bind()
  public async show({response, bouncer}: HttpContextContract, user: User) {
    await bouncer
      .with('UserPolicy')
      .authorize('view', user)

    await user.load('role')
    return response.status(200).json(user)
  }

  @bind()
  public async update({request, response, bouncer}: HttpContextContract, user: User) {
    await bouncer
      .with('UserPolicy')
      .authorize('update', user)

    const payload = await request.validate(UpdateUserValidator)
    await user.merge(payload).save()

    return response.status(200).json({
      message: "User berhasil diubah",
      data: user
    })
  }

  @bind()
  public async destroy({response, bouncer}: HttpContextContract, user: User) {
    await bouncer
      .with('UserPolicy')
      .authorize('delete')

    await user.delete()

    return response.status(200).json({message: "User berhasil dihapus"})
  }
}
