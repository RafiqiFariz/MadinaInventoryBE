import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {bind} from '@adonisjs/route-model-binding'
import Role from "App/Models/Role"
import RoleValidator from "App/Validators/RoleValidator"

export default class RolesController {
  public async index({response}: HttpContextContract) {
    const roles = await Role.all()
    response.status(200).json(roles)
  }

  public async store({request, response}: HttpContextContract) {
    const payload = await request.validate(RoleValidator)
    const role = await Role.create(payload)
    response.status(200).json(role)
  }

  @bind()
  public async show({response}: HttpContextContract, role: Role) {
    response.status(200).json(role)
  }

  @bind()
  public async update({request, response}: HttpContextContract, role: Role) {
    const payload = await request.validate(RoleValidator)
    await role.merge(payload).save()

    response.status(200).json({
      message: "Role berhasil diubah",
      data: role
    })
  }

  @bind()
  public async destroy({response}: HttpContextContract, role: Role) {
    await role.delete()

    response.status(200).json({message: "Role berhasil dihapus"})
  }
}
