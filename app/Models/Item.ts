import {DateTime} from 'luxon'
import {BaseModel, column} from '@ioc:Adonis/Lucid/Orm'

export default class Item extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public code: string

  @column()
  public name: string

  @column()
  public brand_id: number

  @column()
  public item_type_id: number

  @column()
  public price: number

  @column()
  public stock: number

  @column()
  public description: string

  @column()
  public image: string

  @column()
  public stock_min: number

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime
}
