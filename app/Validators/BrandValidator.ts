import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class BrandValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   */
  public schema = schema.create({
    name: schema.string({}, [
      rules.minLength(2),
      rules.maxLength(255),
      rules.unique({table: 'brands', column: 'name'}),
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
    'name.required': 'Nama brand harus diisi.',
    'name.minLength': 'Nama brand minimal 2 karakter.',
    'name.maxLength': 'Nama brand maksimal 255 karakter.',
    'name.unique': 'Nama brand sudah terdaftar.',
  }
}
