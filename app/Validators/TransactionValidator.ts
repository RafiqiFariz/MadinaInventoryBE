import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class TransactionValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   */
  public schema = schema.create({
    items: schema.array().members(schema.object().members({
      id: schema.number([
        rules.required(),
        rules.exists({table: 'items', column: 'id'}),
      ]),
      qty: schema.number([
        rules.required(),
      ]),
    })),
    payment_method: schema.enum(['tunai', 'non-tunai'] as const, [
      rules.required()
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
    'items.*.object': 'Items harus berupa array of objects.',
    'items.*.id.required': 'Barang harus diisi.',
    'items.*.id.exists': 'Barang tidak ditemukan.',
    'items.*.qty.required': 'Setiap barang harus memiliki kuantitas.',
    'payment_method.enum': 'Metode pembayaran harus tunai dan non-tunai.',
    'payment_method.required': 'Metode pembayaran harus diisi.'
  }
}
