'use strict'
const Menu = use('App/Models/Menu')
const MealType = use('App/Models/MealType')
const MenuType = use('App/Models/MenuType')
const Order = use('App/Models/OrderPh')
const Customer = use('App/Models/Customer')
const SaleRecordAff = use('App/Models/SaleRecordsAff')

class OrderPhController {
  async store({ request, response, auth }) {
    const { menu_id, quantity, order_date } = request.all()
  
    // ดึงข้อมูล menu จากตาราง menus
    const menu = await Menu.find(menu_id)
    if (!menu) {
      return response.status(404).json({ message: 'Menu not found' })
    }
  
    // ดึงข้อมูล meal_type จาก meal_types โดยใช้ meal_type_id จาก menu
    const meal_type = await MealType.find(menu.meal_type_id)
    if (!meal_type) {
      return response.status(404).json({ message: 'Meal type not found' })
    }
  
    // ดึงข้อมูล menu_type จาก menu_types โดยใช้ menu_type_id จาก meal_types
    const menu_type = await MenuType.find(meal_type.menu_type_id)
    if (!menu_type) {
      return response.status(404).json({ message: 'Menu type not found' })
    }
  
    // ตอนนี้เราได้ menu_type_id จาก menu_types แล้ว
    const menu_type_id = menu_type.id
  
    const user = await auth.getUser()

    const customer = await Customer.query().where('user_id', user.id).first();
  if (!customer) {
    return response.status(404).json({ message: 'Customer not found' });
  }
  const saleRecord = await SaleRecordAff.query().where('customer_id', customer.id).first();
  if (!saleRecord) {
    return response.status(404).json({ message: 'Sale record not found' });
  }

  // ลบ quantity จาก orders_phs กับ total_boxes จาก sale_records_affs
  const updatedTotalBoxes = saleRecord.total_boxes - quantity;

  // อัพเดต sale record ที่เกี่ยวข้อง
  saleRecord.total_boxes = updatedTotalBoxes;
  await saleRecord.save();  
    // สร้างคำสั่งซื้อใหม่
    const order = await Order.create({
      menu_id,
      quantity,
      order_date,  // ฟิลด์วันที่ในคำสั่งซื้อ
      user_id: user.id,  // เก็บ user_id ของผู้ใช้ที่สั่งซื้อ
      menu_type_id  // เก็บ menu_type_id ที่ได้จาก menu_types
    })
  
    return response.status(201).json({
      order,
    })
  }
  
  
  
  
  async getOrdersByDateRange({ request, response }) {
    const { start_date, end_date } = request.all()

    if (!start_date || !end_date) {
      return response.status(400).json({ message: 'Please provide both start_date and end_date' })
    }

    const orders = await Order.query()
      .where('order_date', '>=', start_date)
      .andWhere('order_date', '<=', end_date)
      .fetch()

    return response.status(200).json({ orders })
  }
}

module.exports = OrderPhController
