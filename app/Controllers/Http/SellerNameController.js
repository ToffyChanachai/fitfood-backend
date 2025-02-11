"use strict";
const SellerName = use("App/Models/SellerName");
const Database = use("Database");
const GoogleSheetService = require("../../Services/CustomersGoogleSheetService");

class SellerNameController {
  async store({ request, response }) {
    const { name } = request.all();
    const sellerName = await SellerName.create({ name });

    return response.status(201).json(sellerName);
  }

  async index({ response }) {
    const sellerNames = await SellerName.all();
    return response.status(200).json(sellerNames);
  }

  async show({ params, response }) {
    const sellerName = await SellerName.find(params.id);

    if (!sellerName) {
      return response.status(404).json({ message: "Seller name not found" });
    }

    return response.status(200).json(sellerName);
  }

  async update({ params, request, response }) {
    const sellerName = await SellerName.find(params.id);

    if (!sellerName) {
      return response.status(404).json({ message: "Seller name not found" });
    }

    const { name } = request.all();
    sellerName.name = name;

    await sellerName.save();

    return response.status(200).json(sellerName);
  }

  async destroy({ params, response }) {
    const sellerName = await SellerName.find(params.id);

    if (!sellerName) {
      return response.status(404).json({ message: "Seller name not found" });
    }

    await sellerName.delete();

    return response
      .status(200)
      .json({ message: "Seller name deleted successfully" });
  }

  async syncData({ response }) {
    const sheetId = "16sVXd29hsC18H0-i3VYtDuZAFMl9aviInsMYwB_Nc4A"; // ID ของ Google Sheet
    const range = "All AFF Customers!S1:S"; // ปรับตาม Range ที่ต้องการ

    try {
      // ดึงข้อมูลจาก Google Sheets
      const sheetData = await GoogleSheetService.getSheetData(sheetId, range);

      // ตรวจสอบการดึงข้อมูล
      if (!sheetData || sheetData.length === 0) {
        return response.status(500).send({ error: 'No data received from Google Sheets' });
      }

      // แปลงข้อมูลที่ดึงมาให้อยู่ในรูปแบบที่ต้องการ
      const formattedData = sheetData.slice(1) // ตัดแถวแรกออก (ถ้ามี header)
        .map((row) => {
          const name = row[0]; // ดึงแค่ชื่อจากข้อมูลแถวแรก

          // ตรวจสอบข้อมูล name ก่อนแทรก
          if (!name) {
            console.warn('Missing name in row:', row); // แจ้งเตือนหากไม่มีชื่อ
            return null; // หากไม่มีชื่อให้ข้ามแถวนี้
          }

          return {
            name, // ส่งแค่ชื่อ
          };
        })
        .filter(row => row !== null); // กรองแถวที่เป็น null ออก

      // ถ้าไม่มีข้อมูลที่ถูกต้องหลังการกรอง
      if (formattedData.length === 0) {
        return response.status(400).send({ error: 'No valid data to insert' });
      }

      // ลบข้อมูลที่ซ้ำ
      const uniqueNames = [...new Set(formattedData.map(item => item.name))]; // ใช้ Set ลบค่าซ้ำ

      // สร้าง array ใหม่ที่มีเฉพาะชื่อที่ไม่ซ้ำ
      const dataToInsert = uniqueNames.map(name => ({ name }));

      // บันทึกข้อมูลลงในฐานข้อมูล (seller_names)
      await Database.table("seller_names").insert(dataToInsert);

      // ส่งผลลัพธ์กลับไปที่ client
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

module.exports = SellerNameController;
