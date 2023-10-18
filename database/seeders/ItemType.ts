import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ItemType from "App/Models/ItemType";

export default class ItemTypeSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    await ItemType.createMany([
      {
        name: 'Besi',
      },
      {
        name: 'Cat',
      },
      {
        name: 'Kayu',
      },
      {
        name: 'Paku',
      },
      {
        name: 'Semen',
      },
      {
        name: 'Pipa',
      },
      {
        name: 'Kabel',
      },
      {
        name: 'Keramik',
      },
      {
        name: 'Tali',
      },
      {
        name: 'Lem',
      }
    ]);
  }
}
