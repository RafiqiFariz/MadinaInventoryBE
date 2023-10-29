import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Transaction from "App/Models/Transaction"
import TransactionDetail from "App/Models/TransactionDetail"
import Item from "App/Models/Item"
import {DateTime} from "luxon"

export default class DashboardController {
  public async index({request, response}: HttpContextContract) {
    const filter = request.input('filter', 'today')

    let result: any = {}
    let start: any = null
    let end: any = null

    // Dapatkan tanggal hari ini
    const today = DateTime.local()

    if (filter === 'today') {
      start = today.startOf('day').toString()
      end = today.endOf('day').toString()
      result = await this.getData(start, end)
    } else if (filter === 'this_week') {
      start = today.startOf('week').toString()
      end = today.endOf('week').toString()
      result = await this.getData(start, end)
    } else if (filter === 'last_week') {
      start = today.minus({weeks: 1}).startOf('week').toString()
      end = today.minus({weeks: 1}).endOf('week').toString()
      result = await this.getData(start, end)
    } else if (filter === 'this_month') {
      start = today.startOf('month').toString()
      end = today.endOf('month').toString()
      result = await this.getData(start, end)
    } else if (filter === 'last_3_month') {
      start = today.minus({months: 3}).startOf('month').toString()
      end = today.minus({months: 3}).endOf('month').toString()
      result = await this.getData(start, end)
    } else if (filter === 'last_6_month') {
      start = today.minus({months: 6}).startOf('month').toString()
      end = today.minus({months: 6}).endOf('month').toString()
      console.log(start, end)
      result = await this.getData(start, end)
    } else if (filter === 'this_year') {
      start = today.startOf('year').toString()
      end = today.endOf('year').toString()
      result = await this.getData(start, end)
    }

    return response.json(result)
  }

  private async getData(start: string, end: string) {
    const transQuery = Transaction.query()
    const transDetailQuery = TransactionDetail.query()
    const itemQuery = Item.query()

    // Income didapatkan dari total harga transaksi yang type nya out (penjualan)
    const income: any = await transDetailQuery
      .whereBetween('created_at', [start, end])
      .where('type', 'out')
      .sum('total_price as income')
      .first()

    // Expense didapatkan dari total harga transaksi yang type nya in (pembelian)
    const expense: any = await transDetailQuery
      .whereBetween('created_at', [start, end])
      .where('type', 'in')
      .sum('total_price as expense')
      .first()

    const totalStock: any = await itemQuery
      .whereBetween('created_at', [start, end])
      .sum('stock as total_stock')
      .first()

    const totalSales: any = await transQuery
      .whereBetween('created_at', [start, end])
      .sum('total_price as total_sales')
      .first()

    return {
      income: +income.$extras.income ?? 0,
      expense: +expense.$extras.expense ?? 0,
      total_stock: +totalStock.$extras.total_stock ?? 0,
      total_sales: +totalSales.$extras.total_sales ?? 0,
    }
  }
}
