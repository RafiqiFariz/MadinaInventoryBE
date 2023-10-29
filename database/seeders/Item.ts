import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Item from "App/Models/Item";

export default class ItemSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    await Item.createMany([
      {
        code: 'BESI-001',
        image: 'https://img.besisni.com/media/images/Besi_Beton_Polos_2.webp',
        name: 'Besi 10mm',
        brandId: 1,
        itemTypeId: 1,
        price: 10000,
        stock: 100,
        stock_min: 5,
      },
      {
        code: 'BESI-002',
        image: 'https://img.besisni.com/media/images/Besi_Beton_Polos_1.webp',
        name: 'Besi 12mm',
        brandId: 2,
        itemTypeId: 1,
        price: 12000,
        stock: 100,
        stock_min: 5,
      },
      {
        code: 'BESI-003',
        image: 'https://images.tokopedia.net/img/cache/500-square/product-1/2018/8/25/6377663/6377663_9fd57f4a-18f4-489c-b900-952e4d950ea0_640_333.jpg.webp?ect=4g',
        name: 'Besi 16mm',
        brandId: 4,
        itemTypeId: 1,
        price: 16000,
        stock: 100,
        stock_min: 5,
      },
      {
        code: 'CAT-001',
        name: 'Cat Tembok 5kg',
        brandId: 9,
        itemTypeId: 2,
        price: 50000,
        stock: 100,
        stock_min: 5,
      },
      {
        code: 'CAT-002',
        name: 'Cat Tembok 10kg',
        brandId: 6,
        itemTypeId: 2,
        price: 100000,
        stock: 100,
        stock_min: 5,
      }
    ]);
  }
}
