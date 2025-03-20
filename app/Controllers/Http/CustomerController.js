"use strict";
const moment = require("moment");

const Customer = use("App/Models/Customer");
const Database = use("Database");
const GoogleSheetService = require("../../Services/CustomersGoogleSheetService");

class CustomerController {
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
  

  // async show({ params, response }) {
  //   try {
  //     const customer = await Customer.findOrFail(params.id);
  //     return response.json(customer);
  //   } catch (error) {
  //     return response
  //       .status(404)
  //       .json({ message: "Customer not found", error });
  //   }
  // }

  // async getCustomerAddress({ params, response }) {
  //   try {
  //     const customer = await Database.table("customers")
  //       .where("id", params.id)
  //       .select("address_mon_to_fri", "address_2", "address_3")
  //       .first();
  //     if (!customer) {
  //       return response.status(404).send({ error: "Customer not found" });
  //     }

  //     return response.status(200).send({
  //       address_mon_to_fri: customer.address_mon_to_fri,
  //       address_2: customer.address_2,
  //       address_3: customer.address_3,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching customer address:", error);
  //     return response.status(500).send({
  //       error: "Failed to fetch customer address",
  //       details: error.message,
  //     });
  //   }
  // }

  async update({ auth, params, request, response }) {
    try {
      const user = await auth.getUser(); // ดึงข้อมูลผู้ใช้ที่ล็อกอิน
      const customer = await Customer.findOrFail(params.id); // ดึงข้อมูลลูกค้าตาม ID
  
      // ถ้าเป็น customer ให้ตรวจสอบว่าเป็นข้อมูลของตัวเองหรือไม่
      if (user.role !== "admin" && customer.user_id !== user.id) {
        return response.status(403).json({ message: "You are not authorized to update this customer's data" });
      }
  
      const data = request.only([
        "email",
        "customer_id",
        "name",
        "gender",
        "tel",
        "line_id",
        "food_allergies",
        "food_allergies_detail",
        "recipient_mon_to_fri",
        "delivery_date",
        "note",
        "seller_name",
        "sellect_by",
        "address_1",
        "address_2",
        "address_3",
        "delivery_address", // ✅ รวมการอัปเดตที่อยู่จัดส่ง
        "delivery_round",
        "deliver",
        "delivery_zone",
        "delivery_time",
      ]);
  
      // ตรวจสอบ gender หากมีการส่งค่าเข้ามา
      if (data.customer_gender) {
        const validGenders = ["male", "female", "other"];
        if (!validGenders.includes(data.customer_gender)) {
          return response.status(400).json({ message: "Invalid gender value" });
        }
      }
  
      // แปลงเวลา delivery_time หากมีการส่งค่าเข้ามา
      if (data.delivery_time) {
        data.delivery_time = moment(data.delivery_time, "HH:mm").format("HH:mm");
      }
  
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
  

  // async getCustomersHHB({ response }) {
  //   try {
  //     const customers_hhbs = await Database.table("customers_hhbs").select("*");
  //     return response.status(200).send(customers_hhbs);
  //   } catch (error) {
  //     console.error("Error fetching customers:", error);
  //     return response
  //       .status(500)
  //       .send({ error: "Failed to fetch customers", details: error.message });
  //   }
  // }

  async syncData({ response }) {
    const sheetId = "16sVXd29hsC18H0-i3VYtDuZAFMl9aviInsMYwB_Nc4A"; // ID ของ Google Sheet
    const range = "All AFF Customers!B1:Z"; // ปรับตาม Range ที่ต้องการ

    try {
      const sheetData = await GoogleSheetService.getSheetData(sheetId, range);

      await Database.raw("TRUNCATE TABLE customers RESTART IDENTITY CASCADE");

      // ดึงข้อมูล seller_names ทั้งหมดจากฐานข้อมูลเพื่อใช้แปลงชื่อเป็น id
      const sellerNames = await Database.table("seller_names").select(
        "id",
        "name"
      );

      // สร้าง object ที่จะช่วยในการแปลงชื่อ seller_name เป็น id
      const sellerNamesMap = sellerNames.reduce((map, seller) => {
        map[seller.name] = seller.id;
        return map;
      }, {});

      // ดึงข้อมูล zone_deliveries ทั้งหมดจากฐานข้อมูลเพื่อใช้แปลงชื่อเป็น id
      const zoneDeliveries = await Database.table("zone_deliveries").select(
        "id",
        "name"
      );

      // สร้าง object ที่จะช่วยในการแปลงชื่อ zone เป็น id
      const zoneMap = zoneDeliveries.reduce((map, zone) => {
        map[zone.name] = zone.id;
        return map;
      }, {});

      const formattedData = sheetData
        .slice(2)
        .map((row) => {
          if (!row[0] || !row[1]) {
            return null;
          }

          // แปลงค่า gender ที่เป็น 'ชาย Male' หรือ 'Female Female' ให้เหลือแค่ 'Male' หรือ 'Female'
          const gender = row[3];
          let formattedGender = null;

          if (gender) {
            // แยกคำจาก 'ชาย Male' เป็น ['ชาย', 'Male'] หรือ 'Female Female' เป็น ['Female', 'Female']
            const genderParts = gender.split(" ");
            const genderValue = genderParts[genderParts.length - 1]; // เอาคำสุดท้าย ('Male' หรือ 'Female')

            // แปลงค่าที่ได้ให้ตรงกับฐานข้อมูล
            if (genderValue === "Male") {
              formattedGender = "male";
            } else if (genderValue === "Female") {
              formattedGender = "female";
            }
          }

          const selectBy = row[18]; // Assuming select_by is in column 18
          let formattedSelectBy = null;

          if (selectBy) {
            if (selectBy.includes("ลูกค้า")) {
              formattedSelectBy = "customer";
            } else if (selectBy.includes("นักโภชนาการของ AFF")) {
              formattedSelectBy = "aff";
            }
          }

          const zone1Id = zoneMap[row[20]] || null; // ถ้าไม่พบชื่อในฐานข้อมูล จะได้ null
          const zone2Id = zoneMap[row[22]] || null;
          const zone3Id = zoneMap[row[24]] || null;

          const sellerId = sellerNamesMap[row[17]] || null;

          return {
            email: row[0],
            customer_id: row[1],
            name: row[2],
            gender: formattedGender,
            tel: row[4],
            line_id: row[5],
            food_allergies: row[6],
            delivery_date: row[7],
            address_mon_to_fri: row[8],
            recipient_mon_to_fri: row[9],
            address_sat_to_sun: row[10],
            recipient_sat_to_sun: row[11],
            other_detail: row[12],
            note: row[16],
            seller_name_id: sellerId,
            select_by: formattedSelectBy,
            address_1: row[8],
            zone_1: zone1Id,
            address_2: row[21],
            zone_2: zone2Id,
            address_3: row[23],
            zone_3: zone3Id,

            // customer_id: row[2],
            // name: row[3],
            // package: row[1],
            // email: row[0],
            // tel: row[4],
            // line_id: row[5],
            // address: row[6],
            // nearby_places: row[7],
            // recipient: row[8],
            // other_detail: row[9],
            // note: row[27],
            // seller_name: row[16],
            // address_1: row[17],
            // zone_1: row[18],
            // address_2: row[19],
            // zone_2: row[20],
            // address_3: row[21],
            // zone_3: row[22],
          };
        })
        .filter((row) => row !== null); // กรองแถวที่เป็น null ออก

      // // ลบข้อมูลที่มี customer_id ซ้ำ
      // for (const data of formattedData) {
      //   const existing = await Database.table("customers_hhbs")
      //     .where("customer_id", data.customer_id)
      //     .first(); // ตรวจสอบข้อมูลที่มี customer_id ซ้ำ

      //   if (existing) {
      //     // ลบข้อมูลที่มี customer_id ซ้ำ
      //     await Database.table("customers_hhbs")
      //       .where("customer_id", data.customer_id)
      //       .delete();
      //   }

      //   // เพิ่มข้อมูลใหม่ที่ไม่ซ้ำ
      //   await Database.table("customers_hhbs").insert(data);
      // }

      // // ตรวจสอบข้อมูลที่ซ้ำใน email ก่อนการแทรก
      // for (const data of formattedData) {
      //   // ตรวจสอบว่า email มีอยู่ในฐานข้อมูลแล้วหรือไม่
      //   const existing = await Database.table("customers")
      //     .where("email", data.email)
      //     .first(); // ดึงแถวที่มี email ซ้ำ

      //   if (!existing) {
      //     // ถ้าไม่มีข้อมูลซ้ำ, ให้แทรกข้อมูลลงฐานข้อมูล
      //     await Database.table("customers").insert(data);
      //   }
      // }

      // ตรวจสอบข้อมูลที่ซ้ำใน email ก่อนการแทรก
      for (const data of formattedData) {
        // ตรวจสอบว่า customer_id หรือ email มีอยู่ในฐานข้อมูลแล้วหรือไม่
        const existingEmail = await Database.table("customers")
          .where("email", data.email)
          .first(); // ตรวจสอบ email ว่าซ้ำหรือไม่

        const existingCustomerId = await Database.table("customers")
          .where("customer_id", data.customer_id)
          .first(); // ตรวจสอบ customer_id ว่าซ้ำหรือไม่

        // ถ้าไม่มีข้อมูลที่ซ้ำ, ให้แทรกข้อมูลใหม่
        if (!existingEmail && !existingCustomerId) {
          await Database.table("customers").insert(data);
        } else {
          // สามารถเพิ่มการจัดการกรณีข้อมูลซ้ำ (เช่นการอัพเดตข้อมูล หรือข้ามการแทรก)
          console.log(
            `Data with email ${data.email} or customer_id ${data.customer_id} already exists.`
          );
        }
      }

      return response
        .status(200)
        .send({ message: "Data synchronized successfully!" });
    } catch (error) {
      console.error("Error syncing data:", error);
      return response
        .status(500)
        .send({ error: "Failed to sync data", details: error.message });
    }
  }
}

module.exports = CustomerController;
