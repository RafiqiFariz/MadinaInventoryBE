import {BasePolicy} from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class UserPolicy extends BasePolicy {
  public async viewList(user: User) {
    return user.roleId === 1 || user.roleId === 2
  }

  public async view(user: User, userToView: User) {
    return user.id === userToView.id || user.roleId === 1
  }

  public async create(user: User) {
    return user.roleId === 1
  }

  public async update(user: User, userToUpdate: User) {
    return user.id === userToUpdate.id || user.roleId === 1
  }

  public async delete(user: User) {
    return user.roleId === 1
  }
}
