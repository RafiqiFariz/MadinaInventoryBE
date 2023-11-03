import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'items'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('code')
      table.string('image').nullable()
      table.string('name')
      table.decimal('price', 10, 0)
      table.integer('stock')
      table.integer('stock_min').nullable()
      table.string('size').nullable()
      table.text('description').nullable()
      table.integer('item_type_id')
        .unsigned()
        .references('item_types.id')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')
      table.integer('brand_id')
        .unsigned()
        .references('brands.id')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at', {useTz: true})
      table.timestamp('updated_at', {useTz: true})
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
