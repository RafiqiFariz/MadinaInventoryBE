import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    await User.createMany([
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: await Hash.make('admin'),
        phone_number: '081234567890',
        role_id: 1,
      },
      {
        name: 'Employee 1',
        email: 'employee1@example.com',
        password: await Hash.make('12345678'),
        phone_number: '081234567891',
        role_id: 2,
      },
      {
        name: 'Employee 2',
        email: 'employee2@example.com',
        password: await Hash.make('12345678'),
        phone_number: '081234567892',
        role_id: 2,
      }
    ]);
  }
}
