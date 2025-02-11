"use strict";
const Database = use("Database");
const GoogleSheetService = require("../../Services/CustomersGoogleSheetService");

class TestController {


  async syncData({ response }) {
    const sheetId = "1bHJ5LWx-4kkn5vcbmR5N8ihQwDQI4XbkrKepd9offEA";
    const range = "Zone!F1:F";

    try {
      const sheetData = await GoogleSheetService.getSheetData(sheetId, range);
      await Database.raw("TRUNCATE TABLE payment_types RESTART IDENTITY CASCADE");

      // const formattedData = sheetData.slice(1).map((row) => {
      //   const name = row[0]; // Column A

      //   return {
      //     name,
      //   };
      // });

      // await Database.table("payment_types").insert(formattedData);


      //จัดรูปแบบข้อมูล Program
      const promotinTypeMap = {
        DOM: 1,
      };
      const formattedData = sheetData.slice(1).map((row) => {
        const name = row[1]; // Column A
        let promotionTypeText = row[0]; // Column B
        const promotionTypeId = programTypeMap[promotionTypeText] || null;

        return {
          name,
          program_id: promotionTypeId,
        };
      });

      formattedData.forEach((item) => {
        if (!nameSet.has(item.name)) {
          uniqueData.push(item);
          nameSet.add(item.name);
        }
      });
      await Database.table("programs").insert(uniqueData);
      

      //  const programTypeMap = {
      //     "premium health": 1,
      //     "low carb": 2,
      //     "fat loss & muscle gain": 3,
      //     "premium personalized": 4,
      //     "absolute therapeutic": 5,
      //     "happy healthy box": 6,
      //   };
      //   const formattedData = sheetData.slice(1).map((row) => {
      //     const name = row[1];
      //     let programTypeText = row[0];
      //     const package_detail = row[2];
      //     const package_validity = row[3];
      //     const total_days = row[4];
      //     const boxes_per_day = row[5];
      //     const total_boxes = row[6];
      //     const price = row[7];
      //     const promotion_detail = row[8];

      //     const free_credit = row[9];
      //     const free_mad = row[10];
      //     const free_dessert = row[11];
      //     const free_brittles = row[12];
      //     const free_energy_balls = row[13];
      //     const free_dressing = row[14];
      //     const free_yoghurt = row[15];
      //     const free_granola = row[16];

      //     programTypeText = programTypeText
      //       ? programTypeText
      //           .trim()
      //           .toLowerCase()
      //           .replace(/[^\w\s&]/g, "")
      //       : null;

      //     const programTypeId = programTypeMap[programTypeText] || null;

      //     const parsedPrice = parseFloat(price.replace(/,/g, ""));

      //     return {
      //       name,
      //       program_id: programTypeId,
      //       package_detail,
      //       package_validity,
      //       total_days,
      //       boxes_per_day,
      //       total_boxes,
      //       price: parsedPrice,
      //       promotion_detail,
      //       free_credit,
      //       free_mad,
      //       free_dessert,
      //       free_brittles,
      //       free_energy_balls,
      //       free_dressing,
      //       free_yoghurt,
      //       free_granola,
      //     };
      //   });
      //   await Database.table("packages").insert(formattedData);

      // Insert ข้อมูลใหม่
      // const formattedData = sheetData.slice(1).map((row) => {
      //   // const price = row[7];

      //   // const parsedPrice = parseInt(price.replace(/,/g, ""), 10);

      //   return {

      //     name: row[0],
      //     // program_name: row[0],
      //     // package_detail: row[2],
      //     // package_validity: row[3],
      //     // total_days: row[4],
      //     // boxes_per_day: row[5],
      //     // total_boxes: row[6],
      //     // price: parsedPrice,
      //     // promotion_detail: row[8],
      //   };
      // });

      // const uniqueData = [...new Set(formattedData.map(item => item.name))].map(name => ({
      //   name
      // }));
      // await Database.table("promotion_types").insert(uniqueData);

      // const uniqueData = [];
      // const nameSet = new Set();

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

module.exports = TestController;
