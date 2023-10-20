import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class TransactionValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   */
  public schema = schema.create({
    user_id: schema.number([
      rules.required(),
      rules.exists({table: 'users', column: 'id'}),
    ]),
    item_id: schema.number([
      rules.required(),
      rules.exists({table: 'items', column: 'id'}),
    ]),
    qty: schema.number([
      rules.required(),
      rules.range(1, 999999999),
    ]),
    type: schema.enum(['in', 'out'] as const, [
      rules.required(),
    ]),
    note: schema.string.optional({}),
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
    'user_id.required': 'User harus diisi.',
    'user_id.exists': 'User tidak ditemukan.',
    'item_id.required': 'Barang harus diisi.',
    'item_id.exists': 'Barang tidak ditemukan.',
    'qty.required': 'Jumlah harus diisi.',
    'qty.range': 'Jumlah harus diantara 1 sampai 999999999.',
    'type.required': 'Tipe transaksi harus diisi.',
  }
}
