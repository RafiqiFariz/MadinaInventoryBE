import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.string('phone_number', 20).nullable()
      table.timestamp('created_at', {useTz: true}).notNullable()
      table.timestamp('updated_at', {useTz: true}).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
