import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class TransactionDetailValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   */
  public schema = schema.create({
    transactionId: schema.number([
      rules.required(),
      rules.exists({table: 'transactions', column: 'id'}),
    ]),
    itemId: schema.number([
      rules.required(),
      rules.exists({table: 'items', column: 'id'}),
    ]),
    qty: schema.number([
      rules.required(),
    ]),
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
    'transactionId.required': 'Transaksi harus diisi.',
    'transactionId.exists': 'Transaksi tidak ditemukan.',
    'itemId.required': 'Barang harus diisi.',
    'itemId.exists': 'Barang tidak ditemukan.',
    'qty.required': 'Kuantitas harus diisi.',
  }
}
