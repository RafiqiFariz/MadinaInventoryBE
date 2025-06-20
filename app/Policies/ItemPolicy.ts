import {BasePolicy} from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
// import Item from 'App/Models/Item'

export default class ItemPolicy extends BasePolicy {
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
