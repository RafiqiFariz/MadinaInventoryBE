import {BasePolicy} from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
// import Role from 'App/Models/Role'

export default class RolePolicy extends BasePolicy {
  public async viewList(user: User) {
    return user.roleId === 1
  }

  public async view(user: User) {
    return user.roleId === 1
  }

  public async create(user: User) {
    return user.roleId === 1
  }

  public async update(user: User) {
    return user.roleId === 1
  }

  public async delete(user: User) {
    return user.roleId === 1
  }
}
