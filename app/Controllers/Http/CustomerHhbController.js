"use strict";
const Customer = use("App/Models/CustomerHhb");

class CustomerHhbController {
  async index({ auth, response }) {
    const user = await auth.getUser(); // ดึงข้อมูล user ที่ล็อกอินอยู่
  
    if (user.role === "admin") {
      // ถ้าเป็น admin ให้ดึงข้อมูลทั้งหมด
      const customers = await Customer.all();  // ดึงข้อมูลทั้งหมด
      return response.json(customers);
    } else {
      // ถ้าเป็น customer ให้ดึงเฉพาะของตัวเอง
      const customers = await Customer.query().where("user_id", user.id).fetch(); // ดึงข้อมูลของตัวเอง
      return response.json(customers);
    }
  }

  async update({ auth, params, request, response }) {
    try {
      const user = await auth.getUser(); // ดึงข้อมูลผู้ใช้ที่ล็อกอิน
      const customer = await Customer.findOrFail(params.id); // ค้นหาลูกค้าตาม ID
  
      // ถ้าเป็น customer ให้ตรวจสอบว่าเป็นข้อมูลของตัวเองหรือไม่
      if (user.role !== "admin" && customer.user_id !== user.id) {
        return response.status(403).json({ message: "You are not authorized to update this customer's data" });
      }
  
      const data = request.only([
        "email",
        "customer_id",
        "name",
        "tel",
        "line_id",
        "nearby_places",
        "address",
        "recipient",
        "note",
        "address_1",
        "address_2",
        "address_3",
        "delivery_address",
        "delivery_round",
        "deliver",
        "delivery_zone",
      ]);
  
      // นำข้อมูลที่แปลงแล้วไป merge กับข้อมูลเดิม
      customer.merge(data);
  
      // บันทึกการเปลี่ยนแปลง
      await customer.save();
  
      return response.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      return response.status(500).json({ message: "Error updating customer", error: error.message });
    }
  }
   
  async destroy({ auth, params, response }) {
    try {
      const user = await auth.getUser(); // ดึงข้อมูลผู้ใช้ที่ล็อกอิน
      const customer = await Customer.findOrFail(params.id); // ค้นหาลูกค้าตาม ID
  
      // ถ้าเป็น customer ให้ตรวจสอบว่าเป็นข้อมูลของตัวเองหรือไม่
      if (user.role !== "admin" && customer.user_id !== user.id) {
        return response.status(403).json({ message: "You are not authorized to delete this customer's data" });
      }
  
      // ลบข้อมูลลูกค้า
      await customer.delete();
  
      return response.json({ message: "Customer deleted successfully" });
    } catch (error) {
      console.error("Error deleting customer:", error);
      return response.status(500).json({ message: "Error deleting customer", error: error.message });
    }
  }
  
}

module.exports = CustomerHhbController;
