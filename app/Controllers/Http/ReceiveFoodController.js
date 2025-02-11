'use strict'

const ReceiveFood = use('App/Models/ReceiveFood')
const Database = use("Database");
const GoogleSheetService = require("../../Services/CustomersGoogleSheetService");

class ReceiveFoodController {
  // อ่านข้อมูลทั้งหมด
  async index ({ response }) {
    const receiveFoods = await ReceiveFood.all()
    return response.json(receiveFoods)
  }

  // อ่านข้อมูลที่มี id เฉพาะ
  async show ({ params, response }) {
    const receiveFood = await ReceiveFood.find(params.id)
    if (!receiveFood) {
      return response.status(404).json({ message: 'Not Found' })
    }
    return response.json(receiveFood)
  }

  // สร้างข้อมูลใหม่
  async store ({ request, response }) {
    const data = request.only(['name'])
    const receiveFood = await ReceiveFood.create(data)
    return response.status(201).json(receiveFood)
  }

  // อัพเดตข้อมูลที่มี id
  async update ({ params, request, response }) {
    const receiveFood = await ReceiveFood.find(params.id)
    if (!receiveFood) {
      return response.status(404).json({ message: 'Not Found' })
    }

    const data = request.only(['name'])
    receiveFood.merge(data)
    await receiveFood.save()

    return response.json(receiveFood)
  }

  // ลบข้อมูลที่มี id
  async destroy ({ params, response }) {
    const receiveFood = await ReceiveFood.find(params.id)
    if (!receiveFood) {
      return response.status(404).json({ message: 'Not Found' })
    }

    await receiveFood.delete()
    return response.status(200).json({ message: 'Deleted Successfully' })
  }

  async syncData({ response }) {
      const sheetId = "1bHJ5LWx-4kkn5vcbmR5N8ihQwDQI4XbkrKepd9offEA";
      const range = "Zone!H1:H";
  
      try {
        const sheetData = await GoogleSheetService.getSheetData(sheetId, range);
      //   await Database.raw(
      //     "TRUNCATE TABLE payment_types RESTART IDENTITY CASCADE"
      //   );
  
        const formattedData = sheetData.slice(1).map((row) => {
          const name = row[0];
  
          return {
            name,
          };
        });
        await Database.table("receive_foods").insert(formattedData);
  
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

module.exports = ReceiveFoodController
