import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {bind} from '@adonisjs/route-model-binding'
import Role from "App/Models/Role"
import RoleValidator from "App/Validators/RoleValidator"

export default class RolesController {
  public async index({request, response, bouncer}: HttpContextContract) {
    await bouncer
      .with('RolePolicy')
      .authorize('viewList')
    const roles = Role.query()
    const includeUsers = +(request.input('include_users', 0))

    if (includeUsers === 1) {
      roles.preload('users')
    }

    response.status(200).json(await roles)
  }

  public async store({request, response, bouncer}: HttpContextContract) {
    await bouncer
      .with('RolePolicy')
      .authorize('create')

    const payload = await request.validate(RoleValidator)
    const role = await Role.create(payload)
    response.status(200).json(role)
  }

  @bind()
  public async show({request, response, bouncer}: HttpContextContract, role: Role) {
    await bouncer
      .with('RolePolicy')
      .authorize('view')

    const includeUsers = +(request.input('include_users', 0))

    if (includeUsers === 1) {
      await role.load('users')
    }

    response.status(200).json(role)
  }

  @bind()
  public async update({request, response, bouncer}: HttpContextContract, role: Role) {
    await bouncer
      .with('RolePolicy')
      .authorize('update')

    const payload = await request.validate(RoleValidator)
    await role.merge(payload).save()

    response.status(200).json({
      message: "Role berhasil diubah",
      data: role
    })
  }

  @bind()
  public async destroy({response, bouncer}: HttpContextContract, role: Role) {
    await bouncer
      .with('RolePolicy')
      .authorize('delete')

    await role.delete()

    response.status(200).json({message: "Role berhasil dihapus"})
  }
}
