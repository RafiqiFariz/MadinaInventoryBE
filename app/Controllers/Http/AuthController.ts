import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User"
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
  public async register({request, response, auth}: HttpContextContract) {
    const {email, password} = request.body()

    let user = await User.findBy('email', email)

    if (user) {
      return response.status(422).json({
        'message': 'Email sudah terdaftar'
      })
    }

    const hashedPassword = await Hash.make(password)

    user = await User.create({
      email,
      password: hashedPassword,
    })

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
        'message': 'Email sudah terdaftar.'
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
