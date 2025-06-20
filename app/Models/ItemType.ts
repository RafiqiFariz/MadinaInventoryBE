import {DateTime} from 'luxon'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import Item from "App/Models/Item";

export default class ItemType extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public name: string

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @hasMany(() => Item)
  public items: HasMany<typeof Item>
}
