import {DateTime} from 'luxon'
import {BaseModel, column, HasMany} from '@ioc:Adonis/Lucid/Orm'
import {hasMany} from "@ioc:Adonis/Lucid/Orm"
import TransactionDetail from "App/Models/TransactionDetail";

export default class Transaction extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public user_id: number

  @column()
  public payment_method: 'tunai' | 'non-tunai'

  @column()
  public note: string

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @hasMany(() => TransactionDetail)
  public details: HasMany<typeof TransactionDetail>
}
