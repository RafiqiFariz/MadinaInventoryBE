import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
// import Transaction from 'App/Models/Transaction'

export default class TransactionPolicy extends BasePolicy {
    public async viewList(user: User) {
        return user.roleId === 1 || user.roleId === 2
    }

    public async view(user: User) {
        return user.roleId === 1 || user.roleId === 2
    }

    public async create(user: User) {
        return user.roleId === 1 || user.roleId === 2
    }

    public async update(user: User) {
        return user.roleId === 1
    }

    public async delete(user: User) {
        return user.roleId === 1
    }
}
