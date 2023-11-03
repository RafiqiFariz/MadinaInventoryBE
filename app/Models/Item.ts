import {DateTime} from 'luxon'
import {BaseModel, column, BelongsTo, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import {belongsTo} from "@adonisjs/lucid/build/src/Orm/Decorators"
import ItemType from "App/Models/ItemType"
import Brand from "App/Models/Brand"
import TransactionDetail from "App/Models/TransactionDetail"

export default class Item extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public code: string

  @column()
  public name: string

  @column()
  public brandId: number

  @column()
  public itemTypeId: number

  @column()
  public price: number

  @column()
  public stock: number

  @column()
  public size: string

  @column()
  public description: string

  @column()
  public image: string

  @column()
  public stock_min: number

  @column()
  public is_active: boolean

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @belongsTo(() => Brand)
  public brand: BelongsTo<typeof Brand>

  @belongsTo(() => ItemType)
  public type: BelongsTo<typeof ItemType>

  @hasMany(() => TransactionDetail)
  public details: HasMany<typeof TransactionDetail>
}
