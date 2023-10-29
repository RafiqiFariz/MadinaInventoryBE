import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Transaction from "App/Models/Transaction"
import Item from "App/Models/Item"
import {DateTime} from "luxon";

export default class DashboardController {
  public async index({response}: HttpContextContract) {
    // Dapatkan tanggal hari ini
    const today = DateTime.local()

    // Rentang waktu
    const startDate = today.startOf('day').toString()
    const endDate = today.endOf('day').toString()

    // Penjualan hari ini
    let salesToday: any = await Transaction.query()
      .whereBetween('created_at', [startDate, endDate])
      .sum('total_price as total_sales_today')
      .first()

    salesToday = salesToday.$extras.total_sales_today ?? 0

    // Penjualan minggu ini
    const startOfWeek = today.startOf('week').toString()
    const endOfWeek = today.endOf('week').toString()
    console.log(startOfWeek, endOfWeek)
    // const salesThisWeek = await Transaction.query()
    //   .whereBetween('created_at', [startOfWeek, endOfWeek])
    //   .sum('total_price as totalSales')

    // Anda dapat melanjutkan dengan menghitung penjualan untuk rentang waktu lainnya

    // Menghitung total stok barang
    const totalStock = await Item.query().sum('stock as totalStock')

    // Menghitung total pengeluaran (expense)

    response.json({
      sales_today: +salesToday,
      // salesThisWeek,
      totalStock,
    })
  }
}
