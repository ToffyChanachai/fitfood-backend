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
        "address_3",

        "delivery_address",
        "delivery_round",
        "deliver",
        "delivery_zone",
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
