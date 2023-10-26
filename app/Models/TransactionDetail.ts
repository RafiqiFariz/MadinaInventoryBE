import {DateTime} from 'luxon'
import {BaseModel, column, BelongsTo} from '@ioc:Adonis/Lucid/Orm'
import {belongsTo} from "@adonisjs/lucid/build/src/Orm/Decorators"
import Transaction from "App/Models/Transaction"
import Item from "App/Models/Item"

export default class TransactionDetail extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public transactionId: number

  @column()
  public itemId: number

  @column()
  public qty: number

  @column()
  public type: 'in' | 'out'

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @belongsTo(() => Transaction)
  public transaction: BelongsTo<typeof Transaction>

  @belongsTo(() => Item)
  public item: BelongsTo<typeof Item>
}
