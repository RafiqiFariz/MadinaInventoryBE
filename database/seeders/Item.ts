import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Item from "App/Models/Item";
import Brand from "App/Models/Brand";
import ItemType from "App/Models/ItemType"
import {faker} from '@faker-js/faker';
import {capitalCase} from "capital-case";

export default class ItemSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  private generateCode(itemType: string, serialNumber: number) {
    const acronym = itemType.substring(0, 3).toUpperCase(); // Mengambil tiga karakter pertama dan mengonversi ke huruf besar
    const paddedSerialNumber = serialNumber.toString().padStart(4, '0'); // Padding angka dengan nol jika kurang dari empat digit
    return `${acronym}-${paddedSerialNumber}`;
  }

  private async generateItems() {
    const brands = await Brand.all()

    for (const brand of brands) {
      const itemTypes = await ItemType.query().orderByRaw('RAND()').limit(5)

      for (const itemType of itemTypes) {
        const multiplier = Math.floor(Math.random() * 10) + 1
        const serialNumber = Math.floor(Math.random() * 10000); // Nomor seri acak dalam rentang 0-9999

        const code = this.generateCode(itemType.name, serialNumber);
        const name = capitalCase(faker.lorem.word());

        await Item.create({
          code,
          image: faker.image.urlPlaceholder({
            width: 400,
            height: 400,
            text: name,
            format: 'png'
          }),
          name,
          brandId: brand.id,
          itemTypeId: itemType.id,
          price: 50 * multiplier * 1000,
          stock: 100,
          stock_min: 5,
          size: '10mm x 12m'
        })
      }
    }
  }

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
        size: '10mm x 12m'
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
        size: '12mm x 12m'
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
        size: '16mm x 12m'
      },
      {
        code: 'CAT-001',
        name: 'Cat Tembok 5kg',
        brandId: 9,
        itemTypeId: 2,
        price: 50000,
        stock: 100,
        stock_min: 5,
        size: '5 KG'
      },
      {
        code: 'CAT-002',
        name: 'Cat Tembok 10kg',
        brandId: 6,
        itemTypeId: 2,
        price: 100000,
        stock: 100,
        stock_min: 5,
        size: '10 KG'
      }
    ])

    // 50 x 5 = 250 items
    for (let i = 0; i < 5; i++) {
      await this.generateItems()
    }
  }
}
