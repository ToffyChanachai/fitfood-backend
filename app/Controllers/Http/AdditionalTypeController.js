"use strict";

const AdditionalType = use("App/Models/AdditionalType");
const Database = use("Database");
const GoogleSheetService = require("../../Services/CustomersGoogleSheetService");

class AdditionalTypeController {
  // อ่านข้อมูลทั้งหมด
  async index({ response }) {
    const additionalTypes = await AdditionalType.all();
    return response.json(additionalTypes);
  }

  // อ่านข้อมูลที่มี id เฉพาะ
  async show({ params, response }) {
    const additionalType = await AdditionalType.find(params.id);
    if (!additionalType) {
      return response.status(404).json({ message: "Not Found" });
    }
    return response.json(additionalType);
  }

  // สร้างข้อมูลใหม่
  async store({ request, response }) {
    const data = request.only(["name"]);
    const additionalType = await AdditionalType.create(data);
    return response.status(201).json(additionalType);
  }

  // อัพเดตข้อมูลที่มี id
  async update({ params, request, response }) {
    const additionalType = await AdditionalType.find(params.id);
    if (!additionalType) {
      return response.status(404).json({ message: "Not Found" });
    }

    const data = request.only(["name"]);
    additionalType.merge(data);
    await additionalType.save();

    return response.json(additionalType);
  }

  // ลบข้อมูลที่มี id
  async destroy({ params, response }) {
    const additionalType = await AdditionalType.find(params.id);
    if (!additionalType) {
      return response.status(404).json({ message: "Not Found" });
    }

    await additionalType.delete();
    return response.status(200).json({ message: "Deleted Successfully" });
  }

  async syncData({ response }) {
    const sheetId = "1bHJ5LWx-4kkn5vcbmR5N8ihQwDQI4XbkrKepd9offEA";
    const range = "Zone!F1:F";

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
      await Database.table("additional_types").insert(formattedData);

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

module.exports = AdditionalTypeController;
