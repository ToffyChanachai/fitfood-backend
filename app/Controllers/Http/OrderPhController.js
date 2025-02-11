'use strict'
const Menu = use('App/Models/Menu')
const Order = use('App/Models/OrderPh')

class OrderPhController {
  async store({ request, response }) {
    const { menu_id, quantity, date } = request.all()
  
    // ค้นหาเมนูที่เลือก
    const menu = await Menu.find(menu_id)
    if (!menu) {
      return response.status(404).json({ message: 'Menu not found' })
    }
  
    // สร้างคำสั่งซื้อใหม่ โดยเก็บวันที่ลงในตาราง orders
    const order = await Order.create({
      menu_id,
      quantity,
      date  // เพิ่มฟิลด์วันที่ในคำสั่งซื้อ
    })
  
    // ส่งผลลัพธ์การสร้างคำสั่งซื้อ
    return response.status(201).json({
      order,
    })
  }
  
}

module.exports = OrderPhController
