import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from "App/Models/Role";

export default class RoleSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    await Role.createMany([
      {
        name: 'Admin',
      },
      {
        name: 'Employee',
      },
      {
        name: 'Customer',
      }
    ]);
  }
}
