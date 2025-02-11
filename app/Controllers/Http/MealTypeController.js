"use strict";

const MealType = use("App/Models/MealType");
const MenuType = use("App/Models/MenuType");
const Database = use("Database");
const GoogleSheetService = require("../../Services/CustomersGoogleSheetService");

class MealTypeController {
  async store({ request, response }) {
    const data = request.only(["name", "menu_type_id"]);

    const menuType = await MenuType.find(data.menu_type_id);
    if (!menuType) {
      return response
        .status(404)
        .json({ message: "ไม่พบข้อมูล Menu type ที่เกี่ยวข้อง" });
    }

    // สร้าง meal type ใหม่
    const mealType = await MealType.create(data);

    return response.status(201).json(mealType);
  }

  async index({ response }) {
    const mealTypes = await MealType.query().with("menuType").fetch();

    return response.json(mealTypes);
  }

  async show({ params, response }) {
    const mealType = await MealType.query()
      .where("id", params.id)
      .with("menuType")
      .first();

    if (!mealType) {
      return response.status(404).json({ message: "ไม่พบข้อมูล Meal type" });
    }

    return response.json(mealType);
  }

  async update({ params, request, response }) {
    const mealType = await MealType.find(params.id);

    if (!mealType) {
      return response.status(404).json({ message: "ไม่พบข้อมูล Meal type" });
    }

    const data = request.only(["name", "menu_type_id"]);

    const menuType = await MenuType.find(data.menu_type_id);
    if (!menuType) {
      return response
        .status(404)
        .json({ message: "ไม่พบข้อมูล Menu type ที่เกี่ยวข้อง" });
    }

    mealType.merge(data);
    await mealType.save();

    return response.json({
      id: mealType.id,
      name: mealType.name,
      menu_type_id: mealType.menu_type_id,  // ส่งค่า menu_type_id กลับไป
      menu_type: menuType,  // ข้อมูล menuType ที่เชื่อมโยง
    });
    
  }

  async destroy({ params, response }) {
    const mealType = await MealType.find(params.id);

    if (!mealType) {
      return response.status(404).json({ message: "ไม่พบข้อมูล Meal type" });
    }

    await mealType.delete();

    return response.status(204).send();
  }

  async syncData({ response }) {
    const sheetId = "1bHJ5LWx-4kkn5vcbmR5N8ihQwDQI4XbkrKepd9offEA";
    const range = "AllMenuHHB!B1:B";

    const nameSet = new Set(); // ใช้ Set เพื่อจัดการกับค่าที่ไม่ซ้ำกัน
    const uniqueData = []; //

    try {
      const sheetData = await GoogleSheetService.getSheetData(sheetId, range);
      // await Database.raw("TRUNCATE TABLE payment_types RESTART IDENTITY CASCADE");

      const formattedData = sheetData.slice(1).map((row) => {
        const name = row[0]; // Column A

        return {
          name,
          menu_type_id: 2,
        };
      });

      formattedData.forEach((item) => {
        if (!nameSet.has(item.name)) {
          uniqueData.push(item);
          nameSet.add(item.name);
        }
      });
      await Database.table("meal_types").insert(uniqueData);

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

module.exports = MealTypeController;
