import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TransactionValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   */
  public schema = schema.create({
    employee_id: schema.number.optional([
      rules.exists({
        table: 'users',
        column: 'id',
        where: {
          role_id: 2
        }
      }),
    ]),
    customer_id: schema.number.optional([
      rules.exists({
        table: 'users',
        column: 'id',
        where: {
          role_id: 3
        }
      }),
    ]),
    items: schema.array([rules.minLength(1)]).members(schema.object().members({
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
    down_payment: schema.number.optional(),
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
    'employee_id.exists': 'Karyawan tidak ditemukan.',
    'customer_id.exists': 'Pelanggan tidak ditemukan.',
    'items.required': 'Items harus diisi.',
    'items.minLength': 'Items harus memiliki minimal 1 item.',
    'items.*.object': 'Items harus berupa array of objects.',
    'items.*.id.required': 'Barang harus diisi.',
    'items.*.id.exists': 'Barang tidak ditemukan.',
    'items.*.qty.required': 'Setiap barang harus memiliki kuantitas.',
    'payment_method.enum': 'Metode pembayaran harus tunai dan non-tunai.',
    'payment_method.required': 'Metode pembayaran harus diisi.',
  }
}
