import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_details'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('transaction_id')
        .unsigned()
        .references('transactions.id')
        .onDelete('CASCADE')
      table.integer('item_id')
        .unsigned()
        .references('items.id')
        .onDelete('RESTRICT')
      table.integer('qty')
      table.enum('type', ['in', 'out'])
      table.timestamp('created_at', {useTz: true})
      table.timestamp('updated_at', {useTz: true})
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
