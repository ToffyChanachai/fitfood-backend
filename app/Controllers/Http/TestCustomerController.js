"use strict";

// const TestCustomer = use("App/Models/TestCustomer");
const User = use("App/Models/User");
const Customer = use("App/Models/Customer");

class TestCustomerController {
  async store({ request, response, auth }) {
    // ดึงข้อมูลจากฟอร์ม
    const {
      customer_id,
      address,
      gender,
      tel,
      line_id,
      food_allergies,
      delivery_date,
      address_mon_to_fri,
      recipient_mon_to_fri,
      address_sat_to_sun,
      recipient_sat_to_sun,
      other_detail,
      note,
      address_1,
      address_2,
      address_3,
      name,
      email,
    } = request.only([
      "customer_id",
      "address",
      "gender",
      "tel",
      "line_id",
      "food_allergies",
      "delivery_date",
      "address_mon_to_fri",
      "recipient_mon_to_fri",
      "address_sat_to_sun",
      "recipient_sat_to_sun",
      "other_detail",
      "note",
      "address_1",
      "address_2",
      "address_3",
      "name", // เพิ่มการรับข้อมูล name
      "email", // เพิ่มการรับข้อมูล email
    ]);

    // ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
    const user = await auth.getUser();

    // อัปเดตข้อมูลลูกค้า
    const customer = await Customer.create({
      user_id: user.id,
      email: email,
      name: name,
      customer_id: customer_id,
      gender: gender,
      tel: tel,
      line_id: line_id,
      food_allergies: food_allergies,
      delivery_date: delivery_date,
      address_1: address_1,
      address_2: address_2,
      address_3: address_3,
    });

    return response.status(201).json({
      message: "Address added successfully",
      customer,
    });
  }

  async checkUserRegistration({ auth, response }) {
    try {
      const user = await auth.getUser(); // ดึงข้อมูลผู้ใช้ที่ล็อกอิน
      const customer = await Customer.query()
        .where("user_id", user.id) // ตรวจสอบว่า user_id นี้มีอยู่ในตาราง TestCustomer
        .first();

      // ถ้าพบข้อมูลของลูกค้า (user_id มีในตาราง)
      if (customer) {
        return response.status(200).json({
          isRegistered: true,
        });
      }

      // ถ้าไม่พบข้อมูล
      return response.status(200).json({
        isRegistered: false,
      });
    } catch (error) {
      return response.status(500).json({
        message: "Error checking user registration",
        error: error.message,
      });
    }
  }

  async update({ request, response, auth, params }) {
    // ดึงค่า customer_id จากพารามิเตอร์ของ URL
    const customerId = params.id;

    // ดึงข้อมูลจากฟอร์ม
    const {
      address,
      gender,
      tel,
      line_id,
      food_allergies,
      delivery_date,
      address_mon_to_fri,
      recipient_mon_to_fri,
      address_sat_to_sun,
      recipient_sat_to_sun,
      other_detail,
      note,
      address_1,
      address_2,
      address_3,
      name,
      email,
    } = request.only([
      "address",
      "gender",
      "tel",
      "line_id",
      "food_allergies",
      "delivery_date",
      "address_mon_to_fri",
      "recipient_mon_to_fri",
      "address_sat_to_sun",
      "recipient_sat_to_sun",
      "other_detail",
      "note",
      "address_1",
      "address_2",
      "address_3",
      "name",
      "email",
    ]);

    try {
      // ตรวจสอบว่าผู้ใช้ล็อกอินอยู่
      const user = await auth.getUser();

      // ค้นหาข้อมูลลูกค้าในฐานข้อมูล
      const customer = await Customer.find(customerId);

      if (!customer) {
        return response.status(404).json({
          message: "Customer not found",
        });
      }

      // ตรวจสอบว่าผู้ใช้ที่ล็อกอินมีสิทธิ์แก้ไขข้อมูลนี้หรือไม่
      if (customer.user_id !== user.id) {
        return response.status(403).json({
          message: "Unauthorized to update this customer",
        });
      }

      // อัปเดตข้อมูลลูกค้า
      customer.merge({
        email,
        name,
        address,
        gender,
        tel,
        line_id,
        food_allergies,
        delivery_date,
        address_mon_to_fri,
        recipient_mon_to_fri,
        address_sat_to_sun,
        recipient_sat_to_sun,
        other_detail,
        note,
        address_1,
        address_2,
        address_3,
      });

      await customer.save();

      return response.status(200).json({
        message: "Customer updated successfully",
        customer,
      });
    } catch (error) {
      return response.status(500).json({
        message: "An error occurred while updating the customer",
        error: error.message,
      });
    }
  }

  async show({ auth, response }) {
    try {
        // ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
        const user = await auth.getUser();

        // ค้นหาข้อมูลลูกค้าโดยใช้ user_id
        const customer = await Customer.query()
            .where("user_id", user.id)
            .first();

        // ตรวจสอบว่าพบข้อมูลหรือไม่
        if (!customer) {
            return response.status(404).json({
                message: "Customer data not found",
            });
        }

        return response.status(200).json({
            message: "Customer data retrieved successfully",
            customer,
        });

    } catch (error) {
        return response.status(500).json({
            message: "An error occurred while retrieving customer data",
            error: error.message,
        });
    }
}

}

module.exports = TestCustomerController;
