/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return {
    name: 'API Madina Inventory App',
    version: '1.0',
    description: 'API Madina Inventory App v1',
    documentation: '',
    status: 200,
  }
})

Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')

Route.group(() => {
  Route.resource('item-types', 'ItemTypesController').apiOnly().except(['index', 'show'])
  Route.resource('roles', 'RolesController').apiOnly().except(['index', 'show'])
  Route.resource('users', 'UsersController').apiOnly().except(['index', 'show'])
  Route.resource('items', 'ItemsController').apiOnly().except(['index', 'show'])
  Route.resource('brands', 'BrandsController').apiOnly().except(['index', 'show'])
  Route.resource('transactions', 'TransactionsController').apiOnly().except(['index', 'show'])
  Route.resource('reports', 'ReportsController').apiOnly()
}).middleware('auth')

Route.resource('item-types', 'ItemTypesController').apiOnly().only(['index', 'show'])
Route.resource('roles', 'RolesController').apiOnly().only(['index', 'show'])
Route.resource('users', 'UsersController').apiOnly().only(['index', 'show'])
Route.resource('items', 'ItemsController').apiOnly().only(['index', 'show'])
Route.resource('brands', 'BrandsController').apiOnly().only(['index', 'show'])
Route.resource('transactions', 'TransactionsController').apiOnly().only(['index', 'show'])
