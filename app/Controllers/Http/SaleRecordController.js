"use strict";
const SaleRecord = use("App/Models/SaleRecord");
const Customer = use("App/Models/Customer");

class SaleRecordController {
  async index({ response }) {
    const sales = await SaleRecord.query().with("customer").fetch();
    return response.json(sales);
  }

  // สร้างบันทึกการขายใหม่
  async store({ request, response }) {
    const data = request.only(["customer_id", "payment_status"]);

    // ตรวจสอบว่ามีลูกค้าหรือไม่
    const customer = await Customer.findBy("customer_id", data.customer_id);
    if (!customer) {
      return response.status(404).json({ message: "Customer not found" });
    }

    const sale = await SaleRecord.create(data);
    return response.status(201).json(sale);
  }

  // แสดงรายละเอียดบันทึกการขาย
  async show({ params, response }) {
    const sale = await SaleRecord.find(params.id);
    if (!sale) {
      return response.status(404).json({ message: "SaleRecord not found" });
    }

    await sale.load("customer"); // โหลดข้อมูลลูกค้าที่เกี่ยวข้อง
    return response.json(sale);
  }

  // แก้ไขบันทึกการขาย
  async update({ params, request, response }) {
    const sale = await SaleRecord.find(params.id);
    if (!sale) {
      return response.status(404).json({ message: "SaleRecord not found" });
    }
    const data = request.only(["product_name", "payment_status"]);
    sale.merge(data);
    await sale.save();
    return response.json(sale);
  }

  // ลบบันทึกการขาย
  async destroy({ params, response }) {
    const sale = await SaleRecord.find(params.id);
    if (!sale) {
      return response.status(404).json({ message: "SaleRecord not found" });
    }
    await sale.delete();
    return response.status(200).json({ message: "SaleRecord deleted" });
  }
}

module.exports = SaleRecordController;
