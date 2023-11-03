import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class UpdateItemValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public refs = schema.refs({
    id: this.ctx.params.id
  })

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   */
  public schema = schema.create({
    code: schema.string.optional({trim: true}, [
      rules.unique({
        table: 'items',
        column: 'code',
        whereNot: {id: this.refs.id},
      }),
      rules.maxLength(255),
    ]),
    image: schema.file.optional({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
    name: schema.string({}, [
      rules.required(),
      rules.minLength(3),
      rules.maxLength(255),
    ]),
    brand_id: schema.number([
      rules.required(),
      rules.exists({table: 'brands', column: 'id'}),
    ]),
    item_type_id: schema.number([
      rules.required(),
      rules.exists({table: 'item_types', column: 'id'}),
    ]),
    price: schema.number([
      rules.required(),
      rules.range(0, 999999999),
    ]),
    stock: schema.number([
      rules.required(),
      rules.range(0, 999999999),
    ]),
    stock_min: schema.number.optional([
      rules.range(0, 999999999),
    ]),
    size: schema.string.optional(),
    is_active: schema.boolean.optional(),
    description: schema.string.optional(),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'code.unique': 'Kode barang sudah terdaftar.',
    'code.maxLength': 'Kode barang maksimal 255 karakter.',
    'image.file.extname': 'Gambar barang harus berupa file gambar.',
    'image.file.size': 'Ukuran gambar barang maksimal 2MB.',
    'name.required': 'Nama barang harus diisi.',
    'name.minLength': 'Nama barang minimal 3 karakter.',
    'name.maxLength': 'Nama barang maksimal 255 karakter.',
    'brand_id.required': 'Merek barang harus diisi.',
    'brand_id.exists': 'Merek barang tidak ditemukan.',
    'item_type_id.required': 'Tipe barang harus diisi.',
    'item_type_id.exists': 'Tipe barang tidak ditemukan.',
    'price.required': 'Harga barang harus diisi.',
    'price.range': 'Harga barang harus diantara 0 sampai 999999999.',
    'stock.required': 'Stok barang harus diisi.',
    'stock.range': 'Stok barang harus diantara 0 sampai 999999999.',
    'stock_min.range': 'Stok minimal barang harus diantara 0 sampai 999999999.',
    'description.maxLength': 'Deskripsi barang maksimal 255 karakter.',
  }
}
