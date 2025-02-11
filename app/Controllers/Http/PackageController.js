"use strict";

const Package = use("App/Models/Package");
const Program = use("App/Models/Program")
const Database = use("Database");
const GoogleSheetService = require("../../Services/CustomersGoogleSheetService");

class PackageController {
  async index({ response }) {
    const packages = await Package.query()
      .with("program.promotionType") // eager load program และ promotionType
      .fetch();
    return response.status(200).send(packages);
  }

  async store({ request, response }) {
    const data = request.only([
      "name",
      "program_id",
      "package_detail",
      "package_validity",
      "total_days",
      "boxes_per_day",
      "total_boxes",
      "price",
      "promotion_detail",
      "free_credit",
      "free_mad",
      "free_dessert",
      "free_brittles",
      "free_energy_balls",
      "free_dressing",
      "free_yoghurt",
      "free_granola",
      "start_date",
    ]);

    if (data.start_date) {
      // หากมีค่า start_date ให้นำไปใช้งาน
      data.start_date = `${data.start_date}-15`; // เปลี่ยนจาก 'YYYY-MM' เป็น 'YYYY-MM-01' เพื่อให้สามารถบันทึกในฐานข้อมูลได้
    }

    const packaged = await Package.create(data);
    return response.status(201).send(packaged);
  }

  async show({ params, response }) {
    const packaged = await Package.query()
      .where("id", params.id)
      .with("program")
      .first();

    if (!packaged) {
      return response.status(404).send({ message: "Package not found" });
    }

    return response.status(200).send(packaged);
  }

  async update({ params, request, response }) {
    const packaged = await Package.find(params.id);

    if (!packaged) {
      return response.status(404).send({ message: "Package not found" });
    }

    const data = request.only([
      "name",
      "program_id",
      "package_detail",
      "package_validity",
      "total_days",
      "boxes_per_day",
      "total_boxes",
      "price",
      "promotion_detail",
      "free_credit",
      "free_mad",
      "free_dessert",
      "free_brittles",
      "free_energy_balls",
      "free_dressing",
      "free_yoghurt",
      "free_granola",
      "start_date",
    ]);

    if (data.start_date) {
      // หากมีค่า start_date ให้นำไปใช้งาน
      data.start_date = `${data.start_date}-15`; // เปลี่ยนจาก 'YYYY-MM' เป็น 'YYYY-MM-01' เพื่อให้สามารถบันทึกในฐานข้อมูลได้
    }

  //   if (data.program_id) {
  //     const program = await Program.find(data.program_id); // ค้นหาโปรแกรมที่เกี่ยวข้อง
  //     if (program) {
  //         // ตั้งค่า promotion_type_id จากโปรแกรมที่เลือก
  //         data.promotion_type_id = program.promotion_type_id;
  //     } else {
  //         return response.status(404).send({ message: "Program not found" });
  //     }
  // }

    packaged.merge(data);
    await packaged.save();

    return response.status(200).send(packaged);
  }

  async destroy({ params, response }) {
    const packaged = await Package.find(params.id);

    if (!packaged) {
      return response.status(404).send({ message: "Package not found" });
    }

    await packaged.delete();
    return response
      .status(200)
      .send({ message: "Package deleted successfully" });
  }

  async syncData({ response }) {
    const sheetId = "1bHJ5LWx-4kkn5vcbmR5N8ihQwDQI4XbkrKepd9offEA";
    const range = "Package!B1:R";

    try {
      const sheetData = await GoogleSheetService.getSheetData(sheetId, range);
      await Database.raw("TRUNCATE TABLE packages RESTART IDENTITY CASCADE");

      const programTypeMap = {
        "premium health": 1,
        "low carb": 2,
        "fat loss & muscle gain": 3,
        "premium personalized": 4,
        "absolute therapeutic": 5,
        "happy healthy box": 6,
      };
      const formattedData = sheetData.slice(1).map((row) => {
        const name = row[1];
        let programTypeText = row[0];
        const package_detail = row[2];
        const package_validity = row[3];
        const total_days = row[4];
        const boxes_per_day = row[5];
        const total_boxes = row[6];
        const price = row[7];
        const promotion_detail = row[8];

        const free_credit = row[9];
        const free_mad = row[10];
        const free_dessert = row[11];
        const free_brittles = row[12];
        const free_energy_balls = row[13];
        const free_dressing = row[14];
        const free_yoghurt = row[15];
        const free_granola = row[16];
        const start_date = null;

        programTypeText = programTypeText
          ? programTypeText
              .trim()
              .toLowerCase()
              .replace(/[^\w\s&]/g, "")
          : null;

        const programTypeId = programTypeMap[programTypeText] || null;

        const parsedPrice = parseFloat(price.replace(/,/g, ""));

        return {
          name,
          program_id: programTypeId,
          package_detail,
          package_validity,
          total_days,
          boxes_per_day,
          total_boxes,
          price: parsedPrice,
          promotion_detail,
          free_credit,
          free_mad,
          free_dessert,
          free_brittles,
          free_energy_balls,
          free_dressing,
          free_yoghurt,
          free_granola,
          start_date,
        };
      });
      await Database.table("packages").insert(formattedData);

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

module.exports = PackageController;
