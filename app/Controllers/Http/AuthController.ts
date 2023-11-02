import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User"
import Hash from '@ioc:Adonis/Core/Hash'
import StoreUserValidator from "App/Validators/StoreUserValidator"

export default class AuthController {
  public async register({request, response, auth}: HttpContextContract) {
    const payload = await request.validate(StoreUserValidator)
    payload['password'] = await Hash.make(payload['password'])
    payload['role_id'] = 2 // karyawan

    const user = await User.create(payload)

    // Generate API token
    const token = await auth.use('api').generate(user)

    return response.json({
      data: {user, token}
    })
  }

  public async login({request, response, auth}: HttpContextContract) {
    const {email, password} = request.body()

    let user = await User.findBy('email', email)

    if (!user) {
      return response.status(422).json({
        'message': 'Email belum terdaftar.'
      })
    }

    // Verify password
    if (!(await Hash.verify(user.password, password))) {
      return response.unauthorized('Password salah.')
    }

    // Generate API token
    const token = await auth.use('api').generate(user)

    return response.json({
      data: {user, token}
    })
  }
}
