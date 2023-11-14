import {DateTime} from 'luxon'
import {BaseModel, column, HasMany, BelongsTo} from '@ioc:Adonis/Lucid/Orm'
import {hasMany} from "@ioc:Adonis/Lucid/Orm"
import TransactionDetail from "App/Models/TransactionDetail";
import {belongsTo} from "@adonisjs/lucid/build/src/Orm/Decorators";
import User from "App/Models/User";

export default class Transaction extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public employeeId: number

  @column()
  public customerId: number

  @column()
  public payment_method: 'tunai' | 'non-tunai'

  @column()
  public total_price: number

  @column()
  public down_payment: number

  @column()
  public remaining_payment: number

  @column()
  public note: string

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @hasMany(() => TransactionDetail)
  public details: HasMany<typeof TransactionDetail>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
