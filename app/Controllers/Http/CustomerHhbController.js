"use strict";
const Customer = use("App/Models/CustomerHhb");

class CustomerHhbController {
  async index({ response }) {
    try {
      const customers = await Customer.all();

      return response.json(customers);
    } catch (error) {
      console.error(error);
      return response.status(500).send("เกิดข้อผิดพลาด");
    }
  }

  async update({ params, request, response }) {
    try {
      // ค้นหาลูกค้าโดย ID
      const customer = await Customer.findOrFail(params.id);
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
        "address_3", // ต้องแปลงเป็น zone_id
      ]);

      customer.merge(data);
      await customer.save();

      return response.json(customer);
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Error updating customer", error });
    }
  }

  async updateDelivery({ params, request, response }) {
    const { delivery_round, deliver, delivery_zone } = request.only([
      "delivery_round", 
      "deliver", 
      "delivery_zone"
    ]);
  
    try {
        const Customer = await Customer.find(params.id);
      if (!Customer) {
        return response.status(404).json({ message: "ไม่พบข้อมูลการขาย" });
      }
  
      // 🛠 อัปเดตข้อมูลการจัดส่ง
      Customer.delivery_round = delivery_round || null; // อัปเดตรอบการจัดส่ง
      Customer.deliver = deliver || null; // อัปเดตการจัดส่ง
      Customer.delivery_zone = delivery_zone || null; // อัปเดตพื้นที่จัดส่ง
  
      // 📝 บันทึกข้อมูลที่อัปเดต
      await Customer.save();
  
      return response.status(200).json({
        message: "อัปเดตข้อมูลการจัดส่งสำเร็จ",
        data: Customer,
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลการจัดส่ง:", error);
      return response.status(500).json({
        message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลการจัดส่ง",
        error: error.message,
      });
    }
  }

  async destroy({ params, response }) {
    try {
      const customer = await Customer.findOrFail(params.id);
      await customer.delete();

      return response.json({ message: "Customer deleted successfully" });
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Error deleting customer", error });
    }
  }
}

module.exports = CustomerHhbController;
