import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Brand from "App/Models/Brand";

export default class BrandSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    await Brand.createMany([
      {
        name: 'Master Steel',
      },
      {
        name: 'Lautan Steel',
      },
      {
        name: 'Krakatau Steel',
      },
      {
        name: 'Gunung Garuda',
      },
      {
        name: 'Aplus',
      },
      {
        name: 'Nippon',
      },
      {
        name: 'Jotun',
      },
      {
        name: 'Avian',
      },
      {
        name: 'Dulux',
      },
      {
        name: 'Catylac',
      },
    ]);
  }
}
