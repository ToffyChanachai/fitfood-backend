"use strict";

const Menu = use("App/Models/Menu");
const MealType = use("App/Models/MealType");
const Database = use("Database");
const GoogleSheetService = require("../../Services/CustomersGoogleSheetService");

const fs = require("fs-extra");
const path = require("path");
const Helpers = use("Helpers");

class MenuController {
  async store({ request, response }) {
    const data = request.only([
      "menu_code",
      "name_english",
      "name_thai",
      "meal_type_id",
      "cal",
      "protein",
      "fat",
      "carb",
    ]);

    const mealType = await MealType.find(data.meal_type_id);
    if (!mealType) {
      return response
        .status(404)
        .json({ message: "ไม่พบข้อมูล Meal type ที่เกี่ยวข้อง" });
    }

    // ตรวจสอบและจัดการกับรูปภาพที่อัปโหลด
    const image = request.file("image", {
      types: ["image"],
      size: "2mb",
    });

    if (image) {
      // สร้างชื่อไฟล์ใหม่และบันทึกไฟล์
      const imageName = `${new Date().getTime()}_${image.clientName}`;
      await image.move(Helpers.publicPath("images"), {
        name: imageName,
        overwrite: true,
      });

      // หากการย้ายไฟล์สำเร็จ, อัปเดต URL รูปภาพ
      if (!image.moved()) {
        return response.status(400).json({ message: image.error().message });
      }

      // เพิ่มข้อมูลชื่อไฟล์รูปภาพใน data
      data.image = imageName; // เก็บชื่อไฟล์รูปภาพในคอลัมน์ 'image'
    }

    // สร้างข้อมูลเมนูใหม่ในฐานข้อมูล
    const menu = await Menu.create(data);
    await menu.load("mealType.menuType");

    return response.status(201).json(menu);
}


  async update({ params, request, response }) {
    const menu = await Menu.find(params.id);

    if (!menu) {
      return response.status(404).json({ message: "ไม่พบข้อมูล Menu" });
    }

    const data = request.only([
      "menu_code",
      "name_english",
      "name_thai",
      "meal_type_id",
      "cal",
      "protein",
      "fat",
      "carb",
    ]);

    // ตรวจสอบว่า meal_type_id มีอยู่จริงใน meal_types หรือไม่
    const mealType = await MealType.find(data.meal_type_id);
    if (!mealType) {
      return response
        .status(404)
        .json({ message: "ไม่พบข้อมูล Meal type ที่เกี่ยวข้อง" });
    }

    // ตรวจสอบและจัดการกับรูปภาพที่อัปโหลด
    const image = request.file("image", {
      types: ["image"],
      size: "2mb",
    });

    if (image) {
      // สร้างชื่อไฟล์ใหม่และบันทึกไฟล์
      const imageName = `${new Date().getTime()}_${image.clientName}`;
      await image.move(Helpers.publicPath("images"), {
        name: imageName,
        overwrite: true,
      });

      // หากการย้ายไฟล์สำเร็จ, อัปเดต URL รูปภาพ
      if (!image.moved()) {
        return response.status(400).json({ message: image.error().message });
      }

      // เพิ่มข้อมูลชื่อไฟล์รูปภาพใน menu
      data.image = imageName; // เก็บชื่อไฟล์รูปภาพในคอลัมน์ 'image'
    }

    // อัปเดตข้อมูลในเมนู
    menu.merge(data);
    await menu.save();

    return response.json(menu);
  }

  async index({ response }) {
    const menus = await Menu.query().with("mealType.menuType").fetch();

    return response.json(menus);
  }

  async show({ params, response }) {
    const menu = await Menu.query()
      .where("id", params.id)
      .with("mealType.menuType")
      .first();

    if (!menu) {
      return response.status(404).json({ message: "ไม่พบข้อมูล Menu" });
    }

    return response.json(menu);
  }

  async destroy({ params, response }) {
    const menu = await Menu.find(params.id);

    if (!menu) {
      return response.status(404).json({ message: "ไม่พบข้อมูล Menu" });
    }

    await menu.delete();

    return response.status(204).send();
  }

  // async syncData({ response }) {
  //   const sheetId = "1bHJ5LWx-4kkn5vcbmR5N8ihQwDQI4XbkrKepd9offEA";
  //   const range = "AllMenuPH!B1:I";

  //   try {
  //     const sheetData = await GoogleSheetService.getSheetData(sheetId, range);
  //      await Database.raw("TRUNCATE TABLE menus RESTART IDENTITY CASCADE");

  //     const mealTypeMap = {
  //       "Main - Chicken": 1,
  //       "Main - Salmon": 2,
  //       "Main - Sea Bass": 3,
  //       "Main - Seafood": 4,
  //       "Main - Dory": 5,
  //       "Main - Duck": 6,
  //       "Main - Yoghurt Breakfast": 7,
  //       "Main - Asian Breakfast": 8,
  //       "Main - Western Breakfast": 9,
  //       "Main - Vegetarian": 10,
  //       "Appetizer - Chicken": 11,
  //       "Appetizer - Salmon": 12,
  //       "Appetizer - Sea Bass": 13,
  //       "Appetizer - Seafood": 14,
  //       "Appetizer - Duck": 15,
  //       "Appetizer - Vegetarian": 16,
  //       "Dessert - Dessert Breakfast": 17,
  //       "Dessert - Daily Dessert": 18,
  //       "Daily Snack": 19,
  //       "Energy Balls": 20,
  //       "Yoghurt": 21,
  //     };

  //     const formattedData = sheetData.slice(1).map((row) => {
  //       const menu_code = row[1];
  //       const name_english = row[2];
  //       const name_thai = row[3];
  //       const mealTypeText = row[0];
  //       const meal_type_id = mealTypeMap[mealTypeText.trim()] || null;
  //       const cal = row[4] ? parseInt(row[4].match(/\d+/)?.[0] || "0", 10) : 0;
  //       const protein = row[5];
  //       const fat = row[6];
  //       const carb = row[7];

  //       return {
  //         menu_code,
  //         name_english,
  //         name_thai,
  //         meal_type_id,
  //         cal,
  //         protein,
  //         fat,
  //         carb,
  //       };
  //     });

  //     await Database.table("menus").insert(formattedData);

  //     return response
  //       .status(200)
  //       .send({ message: "Data synchronized successfully!" });
  //   } catch (error) {
  //     console.error("Error syncing data:", error);
  //     return response
  //       .status(500)
  //       .send({ error: "Failed to sync data", details: error.message });
  //   }
  // }

  // async syncData({ response }) {
  //   const sheetId = "1bHJ5LWx-4kkn5vcbmR5N8ihQwDQI4XbkrKepd9offEA";
  //   const range = "AllMenuHHB!B1:I";

  //   try {
  //     const sheetData = await GoogleSheetService.getSheetData(sheetId, range);
  //     //await Database.raw("TRUNCATE TABLE menus RESTART IDENTITY CASCADE");

  //     const mealTypeMap = {
  //       "Main - Chicken": 22,
  //       "Main - Salmon": 23,
  //       "Main - Sea Bass": 24,
  //       "Main - Dory": 25,
  //       "Main - Duck": 26,
  //       "Main - Vegetarian": 27,
  //       "Main - Vegan (J)": 28,
  //       Appetizer: 29,
  //     };

  //     const formattedData = sheetData.slice(1).map((row) => {
  //       const menu_code = row[1];
  //       const name_english = row[2];
  //       const name_thai = row[3];
  //       const mealTypeText = row[0];
  //       const meal_type_id = mealTypeMap[mealTypeText.trim()] || null;
  //       const cal = row[4] ? parseInt(row[4].match(/\d+/)?.[0] || "0", 10) : 0;
  //       const protein = row[5];
  //       const fat = row[6];
  //       const carb = row[7];

  //       return {
  //         menu_code,
  //         name_english,
  //         name_thai,
  //         meal_type_id,
  //         cal,
  //         protein,
  //         fat,
  //         carb,
  //       };
  //     });

  //     await Database.table("menus").insert(formattedData);

  //     return response
  //       .status(200)
  //       .send({ message: "Data synchronized successfully!" });
  //   } catch (error) {
  //     console.error("Error syncing data:", error);
  //     return response
  //       .status(500)
  //       .send({ error: "Failed to sync data", details: error.message });
  //   }
  // }

  async syncData({ response }) {
    const sheetId = "1bHJ5LWx-4kkn5vcbmR5N8ihQwDQI4XbkrKepd9offEA";
    const range = "AllMenuATโรคไขมัน!B1:I";

    try {
      const sheetData = await GoogleSheetService.getSheetData(sheetId, range);
      //await Database.raw("TRUNCATE TABLE menus RESTART IDENTITY CASCADE");

      const mealTypeMap = {
        "Appetizer - Chicken": 72,
        "Appetizer - Salmon": 73,
        "Appetizer - Sea Bass": 74,
        "Appetizer - Seafood": 75,       
        "Appetizer - Vegetarian": 76,
        "Main - Asian Breakfast": 77,
        "Main - Chicken": 78,
        "Main - Salmon": 79,
        "Main - Sea Bass": 80,
        "Main - Seafood": 81,
        "Main - Vegetarian": 82,
        "Main - Western Breakfast": 83,

      };

      const formattedData = sheetData.slice(1).map((row) => {
        const menu_code = row[1];
        const name_english = row[2];
        const name_thai = row[3];
        const mealTypeText = row[0];
        const meal_type_id = mealTypeMap[mealTypeText.trim()] || null;
        const cal = row[4] ? parseInt(row[4].match(/\d+/)?.[0] || "0", 10) : 0;
        const protein = row[5];
        const fat = row[6];
        const carb = row[7];

        return {
          menu_code,
          name_english,
          name_thai,
          meal_type_id,
          cal,
          protein,
          fat,
          carb,
        };
      });

      await Database.table("menus").insert(formattedData);

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

module.exports = MenuController;
