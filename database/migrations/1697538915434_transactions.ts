import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('employee_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
      table.integer('customer_id')
        .unsigned()
        .references('users.id')
        .nullable()
      table.enum('payment_method', ['tunai', 'non-tunai'])
      table.decimal('total_price', 12, 0)
      table.decimal('down_payment', 12, 0).nullable()
      table.decimal('remaining_payment', 12, 0).nullable()
      table.text('note').nullable()
      table.timestamp('created_at', {useTz: true})
      table.timestamp('updated_at', {useTz: true})
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
