const moment = require("moment");

("use strict");
const Menu = use("App/Models/Menu");
const MealType = use("App/Models/MealType");
const MenuType = use("App/Models/MenuType");
const Order = use("App/Models/Order");
const Customer = use("App/Models/Customer");
const SaleRecordAff = use("App/Models/SaleRecordsAff");

class OrderController {
  async store({ request, response, auth }) {
    const { menu_id, quantity, order_date } = request.all();

    // ดึงข้อมูล user ที่ล็อกอิน
    const user = await auth.getUser();

    // ค้นหา customer_id จาก user_id
    const customer = await Customer.findBy("user_id", user.id);
    if (!customer) {
      return response
        .status(404)
        .json({ message: "ไม่พบข้อมูลลูกค้าสำหรับผู้ใช้นี้" });
    }

    // ตรวจสอบว่าเมนูที่เลือกมีอยู่จริงหรือไม่
    const menu = await Menu.find(menu_id);
    if (!menu) {
      return response.status(404).json({ message: "Menu not found" });
    }

    const meal_type = await MealType.find(menu.meal_type_id);
    if (!meal_type) {
      return response.status(404).json({ message: "Meal type not found" });
    }

    const menu_type = await MenuType.find(meal_type.menu_type_id);
    if (!menu_type) {
      return response.status(404).json({ message: "Menu type not found" });
    }

    const menu_type_id = menu_type.id;

    const order = await Order.create({
      menu_id,
      quantity,
      order_date,
      user_id: user.id, // เก็บ user_id ด้วย
      customer_id: customer.id, // เพิ่ม customer_id จากที่หาได้
      menu_type_id,
      status: "pending",
      package_status: package_status || "calculate",
    });

    return response.status(201).json({
      order,
    });
  }

  async storeAdd({ request, response, auth }) {
    const { menu_id, quantity, order_date, customer_id, package_status } = request.all();
  
    // ตรวจสอบว่า customer_id ถูกส่งมาหรือไม่
    const customer = await Customer.find(customer_id);
    if (!customer) {
      return response
        .status(404)
        .json({ message: "ไม่พบข้อมูลลูกค้าสำหรับ customer_id นี้" });
    }
  
    // ดึง user_id จาก customer
    const user_id = customer.user_id;
  
    // ตรวจสอบว่าเมนูที่เลือกมีอยู่จริงหรือไม่
    const menu = await Menu.find(menu_id);
    if (!menu) {
      return response.status(404).json({ message: "Menu not found" });
    }
  
    const meal_type = await MealType.find(menu.meal_type_id);
    if (!meal_type) {
      return response.status(404).json({ message: "Meal type not found" });
    }
  
    const menu_type = await MenuType.find(meal_type.menu_type_id);
    if (!menu_type) {
      return response.status(404).json({ message: "Menu type not found" });
    }
  
    const menu_type_id = menu_type.id;
  
    const order = await Order.create({
      menu_id,
      quantity,
      order_date,
      user_id, // ใช้ user_id จาก customer
      customer_id, // ใช้ customer_id ที่เลือก
      menu_type_id,
      status: "pending",
      package_status: package_status || 'calculate'
    });
  
    return response.status(201).json({
      order,
    });
  }
  

  async updateQuantity({ request, response, params }) {
    const { quantity } = request.all();

    if (!quantity || quantity <= 0) {
      return response.status(400).json({ message: "จำนวนต้องมากกว่าศูนย์" });
    }

    const order = await Order.find(params.id);
    if (!order) {
      return response.status(404).json({ message: "ไม่พบคำสั่งซื้อนี้" });
    }

    // อัปเดตจำนวนในคำสั่งซื้อ
    order.quantity = quantity;

    // บันทึกการเปลี่ยนแปลง
    await order.save();

    return response.status(200).json({
      message: "จำนวนคำสั่งซื้อถูกอัปเดตแล้ว",
      order,
    });
  }

  async destroy({ params, response }) {
    const order = await Order.find(params.id);

    if (!order) {
      return response.status(404).json({ message: "ไม่พบข้อมูล Meal type" });
    }

    await order.delete();

    return response.status(204).send();
  }

  async getOrdersByDateRange({ request, response }) {
    const { start_date, end_date } = request.all();

    if (!start_date || !end_date) {
      return response
        .status(400)
        .json({ message: "Please provide both start_date and end_date" });
    }

    const orders = await Order.query()
      .where("order_date", ">=", start_date)
      .andWhere("order_date", "<=", end_date)
      .fetch();

    return response.status(200).json({ orders });
  }

  async updateStatus({ params, request, response, auth }) {
    const { status } = request.only(["status"]);

    try {
      const order = await Order.find(params.id);
      if (!order) {
        return response
          .status(404)
          .json({ message: "ไม่พบข้อมูลบันทึกยอดขาย" });
      }

      const user = await auth.getUser();
      const customer = await Customer.query().where("user_id", user.id).first();
      if (!customer) {
        return response.status(404).json({ message: "Customer not found" });
      }

      let saleRecord = await SaleRecordAff.query()
        .where("customer_id", customer.id)
        .orderBy("id", "asc") // จัดเรียงตาม ID เพื่อให้ได้บันทึกแรก
        .first();

      if (!saleRecord) {
        return response.status(404).json({ message: "Sale record not found" });
      }

      while (
        saleRecord.total_boxes === 0 ||
        saleRecord.remaining_days <= 0 ||
        saleRecord.payment_status === "unpaid"
      ) {
        saleRecord = await SaleRecordAff.query()
          .where("customer_id", customer.id)
          .where("id", ">", saleRecord.id) // ค้นหาบันทึกถัดไปที่มี id มากกว่าบันทึกปัจจุบัน
          .orderBy("id", "asc")
          .first();

        if (!saleRecord) {
          break; // ถ้าไม่พบบันทึกถัดไป ให้หยุดการค้นหา
        }
      }

      if (
        !saleRecord ||
        saleRecord.total_boxes === 0 ||
        saleRecord.remaining_days < 0 ||
        saleRecord.payment_status === "unpaid"
      ) {
        return response
          .status(404)
          .json({ message: "ไม่พบบันทึกยอดขายที่มีจำนวน total_boxes" });
      }

      // 🟢 **คำนวณเฉพาะเมื่อ package_status === "calculate"**
      if (order.package_status === "calculate") {
        if (order.status === "pending" && status === "confirm") {
          saleRecord.total_boxes -= order.quantity; // ลด quantity
        }
        await saleRecord.save();
      }

      if (status === "pending") {
        if (order.package_status === "calculate") {
          // คืนค่า total_boxes เฉพาะเมื่อ package_status === "calculate"
          const originalSaleRecord = await SaleRecordAff.find(
            order.sale_record_id
          );
          if (originalSaleRecord) {
            originalSaleRecord.total_boxes += order.quantity; // คืนค่า total_boxes
            await originalSaleRecord.save();
          }
        }
        order.sale_record_id = null;
      } else {
        order.sale_record_id = saleRecord.id;
      }

      // อัปเดตสถานะของคำสั่งซื้อ
      order.status = status;
      await order.save();

      return response.status(200).json({
        message: "อัพเดทสถานะการชำระเงินสำเร็จ",
        data: order,
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัพเดทสถานะการชำระเงิน:", error);
      return response.status(500).json({
        message: "เกิดข้อผิดพลาดในการอัพเดทสถานะการชำระเงิน",
        error: error.message,
      });
    }
  }


  async updateMultipleStatus({ request, response, auth }) {
    const { order_ids, status } = request.only(["order_ids", "status"]);

    try {
      const orders = await Order.query().whereIn("id", order_ids).fetch();

      if (orders.rows.length === 0) {
        return response.status(404).json({ message: "ไม่พบออเดอร์ที่เลือก" });
      }

      for (let order of orders.rows) {
        const customer = await Customer.query()
          .where("user_id", order.user_id)
          .first();

        if (!customer) {
          return response.status(404).json({ message: "ไม่พบข้อมูลลูกค้า" });
        }

        let saleRecord = await SaleRecordAff.query()
          .where("customer_id", customer.id)
          .orderBy("id", "asc") // จัดเรียงตาม ID เพื่อให้ได้บันทึกแรก
          .first();

        if (!saleRecord) {
          return response
            .status(404)
            .json({ message: "ไม่พบข้อมูลบันทึกยอดขาย" });
        }

        while (
          saleRecord.total_boxes === 0 ||
          saleRecord.remaining_days <= 0 ||
          saleRecord.payment_status === "unpaid"
        ) {
          saleRecord = await SaleRecordAff.query()
            .where("customer_id", customer.id)
            .where("id", ">", saleRecord.id)
            .orderBy("id", "asc")
            .first();

          if (!saleRecord) {
            break;
          }
        }

        if (
          !saleRecord ||
          saleRecord.total_boxes === 0 ||
          saleRecord.remaining_days <= 0 ||
          saleRecord.payment_status === "unpaid"
        ) {
          continue; // ข้ามไปยังออเดอร์ถัดไป
        }

        // 🟢 **เช็ค package_status ก่อนคำนวณ**
        if (order.package_status === "calculate") {
          if (order.status === "pending" && status === "confirm") {
            saleRecord.total_boxes -= order.quantity;
          }
          // บันทึกการเปลี่ยนแปลงใน saleRecord
          await saleRecord.save();
        }

        // ถ้าสถานะเป็น "pending", ให้ตั้งค่า sale_record_id เป็น null
        if (status === "pending") {
          if (order.package_status === "calculate") {
            // คืนค่า total_boxes ของ sale_record_id นั้น
            const originalSaleRecord = await SaleRecordAff.find(
              order.sale_record_id
            );
            if (originalSaleRecord) {
              originalSaleRecord.total_boxes += order.quantity; // คืนค่า total_boxes
              await originalSaleRecord.save();
            }
          }
          order.sale_record_id = null;
        } else {
          // ถ้าสถานะไม่เป็น "pending", ให้ตั้งค่า sale_record_id ตามที่คำนวณ
          order.sale_record_id = saleRecord.id;
        }

        // อัปเดตสถานะของคำสั่งซื้อ
        order.status = status;
        await order.save();
      }

      return response.status(200).json({
        message: "อัพเดทสถานะสำเร็จ",
        updatedOrders: orders,
      });
    } catch (error) {
      return response.status(500).json({
        message: "เกิดข้อผิดพลาด",
        error: error.message,
      });
    }
  }


  async getOrdersByUserId({ params, request, response }) {
    const { customer_id } = params; // รับ customer_id จากพารามิเตอร์ URL
    const { start_date, end_date } = request.all(); // รับวันที่เริ่มต้นและสิ้นสุดจากพารามิเตอร์ URL

    try {
      // กรองคำสั่งซื้อโดย customer_id และช่วงวันที่
      const query = Order.query().where("customer_id", customer_id);

      if (start_date) {
        query.where("order_date", ">=", start_date); // กรองตั้งแต่วันที่เริ่มต้น
      }

      if (end_date) {
        query.where("order_date", "<=", end_date); // กรองจนถึงวันที่สิ้นสุด
      }

      const orders = await query.fetch();

      if (orders.rows.length === 0) {
        return response.status(404).json({
          message: "ไม่พบคำสั่งซื้อสำหรับลูกค้ารายนี้ในช่วงวันที่ที่ระบุ",
        });
      }

      return response.status(200).json({ orders });
    } catch (error) {
      return response.status(500).json({
        message: "เกิดข้อผิดพลาดในการดึงประวัติการสั่งซื้อ",
        error: error.message,
      });
    }
  }

  async getOrdersByDate({ request, response }) {
    const { start_date, end_date } = request.all(); // รับวันที่เริ่มต้นและสิ้นสุดจากพารามิเตอร์ URL

    try {
      // กรองคำสั่งซื้อโดยช่วงวันที่
      const query = Order.query();

      if (start_date) {
        query.where("order_date", ">=", start_date); // กรองตั้งแต่วันที่เริ่มต้น
      }

      if (end_date) {
        query.where("order_date", "<=", end_date); // กรองจนถึงวันที่สิ้นสุด
      }

      const orders = await query.fetch();

      if (orders.rows.length === 0) {
        return response.status(404).json({
          message: "ไม่พบคำสั่งซื้อในช่วงวันที่ที่ระบุ",
        });
      }

      return response.status(200).json({ orders });
    } catch (error) {
      return response.status(500).json({
        message: "เกิดข้อผิดพลาดในการดึงประวัติการสั่งซื้อ",
        error: error.message,
      });
    }
  }
}

module.exports = OrderController;
