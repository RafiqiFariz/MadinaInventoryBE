import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public refs = schema.refs({
    id: this.ctx.params.id
  })

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   */
  public schema = schema.create({
    name: schema.string({}, [
      rules.required(),
      rules.maxLength(255),
    ]),
    email: schema.string({}, [
      rules.required(),
      rules.email(),
      rules.maxLength(255),
      rules.unique({
        table: 'users',
        column: 'email',
        whereNot: {id: this.refs.id},
      }),
    ]),
    password: schema.string({}, [
      rules.required(),
      rules.minLength(8),
      rules.maxLength(255),
    ]),
    phone_number: schema.string.optional({}, [
      rules.maxLength(255),
    ]),
    role_id: schema.number.optional([
      rules.exists({table: 'roles', column: 'id'}),
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
    'name.required': 'Nama harus diisi.',
    'name.maxLength': 'Nama maksimal 255 karakter.',
    'email.required': 'Email harus diisi.',
    'email.email': 'Email tidak valid.',
    'email.maxLength': 'Email maksimal 255 karakter.',
    'email.unique': 'Email sudah terdaftar.',
    'password.required': 'Password harus diisi.',
    'password.minLength': 'Password minimal 8 karakter.',
    'password.maxLength': 'Password maksimal 255 karakter.',
    'phone_number.maxLength': 'Nomor telepon maksimal 255 karakter.',
    'role_id.exists': 'Role tidak tersedia.',
  }
}
