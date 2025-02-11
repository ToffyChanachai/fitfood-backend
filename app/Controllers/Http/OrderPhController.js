'use strict'
const Menu = use('App/Models/Menu')
const Order = use('App/Models/OrderPh')

class OrderPhController {
  async store({ request, response, auth }) {
    const { menu_id, quantity, order_date } = request.all()
  
    // ค้นหาเมนูที่เลือก
    const menu = await Menu.find(menu_id)
    if (!menu) {
      return response.status(404).json({ message: 'Menu not found' })
    }
  
    // ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
    const user = await auth.getUser()
  
    // สร้างคำสั่งซื้อใหม่ โดยเก็บวันที่และ user_id ลงในตาราง orders
    const order = await Order.create({
      menu_id,
      quantity,
      order_date,  // ฟิลด์วันที่ในคำสั่งซื้อ
      user_id: user.id  // เก็บ user_id ของผู้ใช้ที่สั่งซื้อ
    })
  
    // ส่งผลลัพธ์การสร้างคำสั่งซื้อ
    return response.status(201).json({
      order,
    })
  }
  
  async getOrdersByDateRange({ request, response }) {
    const { start_date, end_date } = request.all()

    // ตรวจสอบการให้ค่า start_date และ end_date
    if (!start_date || !end_date) {
      return response.status(400).json({ message: 'Please provide both start_date and end_date' })
    }

    // แปลงวันที่ในรูปแบบที่สามารถเปรียบเทียบได้
    const orders = await Order.query()
      .where('order_date', '>=', start_date)
      .andWhere('order_date', '<=', end_date)
      .fetch()

    return response.status(200).json({ orders })
  }
}

module.exports = OrderPhController
