import {BasePolicy} from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
// import ItemType from 'App/Models/ItemType'

export default class ItemTypePolicy extends BasePolicy {
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
