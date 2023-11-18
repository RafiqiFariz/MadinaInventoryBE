import {DateTime} from 'luxon'
import { BaseModel, column, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Role from "App/Models/Role";
import {belongsTo} from "@adonisjs/lucid/build/src/Orm/Decorators";
import Transaction from "App/Models/Transaction";

export default class User extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({serializeAs: null})
  public password: string

  @column()
  public phone_number: string

  @column()
  public roleId: number

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @hasMany(() => Transaction, {
    foreignKey: 'employeeId',
  })
  public employeeTransactions: HasMany<typeof Transaction>

  @hasMany(() => Transaction, {
    foreignKey: 'customerId',
  })
  public customerTransactions: HasMany<typeof Transaction>
}
