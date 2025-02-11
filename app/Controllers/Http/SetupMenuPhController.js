"use strict";

const { DateTime } = require("luxon"); // ใช้ Luxon เพื่อคำนวณวันที่
const Setting = use("App/Models/Setting");
const SetupMenuPh = use("App/Models/SetupMenuPh");

class SetupMenuPhController {
  async index({ response }) {
    try {
      const menus = await SetupMenuPh.query()
        .with("menu", (builder) => {
          builder.with("mealType"); // ดึงข้อมูล mealType จากการเชื่อมโยงกับ menu
        })
        .fetch();
  
      const weekMenus = {};
  
      // ลูปเพื่อจัดกลุ่มข้อมูลตามสัปดาห์
      for (const menu of menus.rows) {
        const dateToShow = await this.getDateToShow(menu.day_of_week); // เรียกใช้ getDateToShow
  
        // คำนวณ Week จาก day_of_week
        const weekNumber = `Week ${Math.ceil(menu.day_of_week / 7)}`;
  
        if (!weekMenus[weekNumber]) {
          weekMenus[weekNumber] = [];
        }
  
        weekMenus[weekNumber].push({
          date_to_show: dateToShow, // เพิ่มวันที่ที่ต้องแสดง
          id: menu.id,
          day_of_week: menu.day_of_week,
          menu_id: menu.menu_id,
          created_at: menu.created_at,
          updated_at: menu.updated_at,
        });
      }
  
      return response.json(weekMenus);
    } catch (error) {
      console.error("Error:", error);
      return response.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู" });
    }
  }
  

  async store({ request, response }) {
    const { day_of_week, menus } = request.only(["day_of_week", "menus"]);

    if (!Array.isArray(menus)) {
      return response.status(400).json({ message: "Menus should be an array" });
    }

    const menusWithDayOfWeek = menus.map((menu) => ({
      menu_id: menu.menu_id, // ใช้ menu_id จากที่ส่งมา
      day_of_week: day_of_week,
    }));

    const createdMenus = await SetupMenuPh.createMany(menusWithDayOfWeek);

    return response.status(201).json(createdMenus);
  }

  async update({ params, request, response }) {
    const { id } = params; // รับ id จาก URL
    const { day_of_week, menu_id } = request.only(["day_of_week", "menu_id"]);

    // ค้นหาข้อมูลที่ตรงกับ id
    const setupMenu = await SetupMenuPh.findOrFail(id);

    // อัปเดตค่า day_of_week และ menu_id
    setupMenu.day_of_week = day_of_week;
    setupMenu.menu_id = menu_id;

    // บันทึกข้อมูลที่อัปเดต
    await setupMenu.save();

    return response
      .status(200)
      .json({ message: "Menu updated successfully", setupMenu });
  }

  async destroy({ params, response }) {
    const { id } = params; // รับ id จาก URL

    // ค้นหาข้อมูลที่ตรงกับ id
    const setupMenu = await SetupMenuPh.findOrFail(id);

    // ลบข้อมูลที่ค้นพบ
    await setupMenu.delete();

    return response.status(200).json({ message: "Menu deleted successfully" });
  }

  async setStartDate({ request, response }) {
    const { startDate } = request.only(["startDate"]);

    try {
      if (!DateTime.fromISO(startDate).isValid) {
        return response.status(400).json({ message: "รูปแบบวันที่ไม่ถูกต้อง" });
      }

      let setting = await Setting.findBy("key", "start_date");
      if (setting) {
        setting.value = startDate;
      } else {
        setting = new Setting();
        setting.key = "start_date";
        setting.value = startDate;
      }
      await setting.save();

      return response.json({ message: "อัปเดตวันเริ่มต้นสำเร็จ", startDate });
    } catch (error) {
      return response.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตวันเริ่มต้น" });
    }
  }

  async getStartDate() {
    const setting = await Setting.findBy("key", "start_date");
    return setting ? setting.value : "2025-01-31"; // ค่าเริ่มต้น
  }

  async getDayOfWeekFromDate(dateString) {
    const startDateStr = await this.getStartDate(); // วันที่เริ่มต้นที่ตั้งไว้
    const startDate = DateTime.fromISO(startDateStr); // แปลงเป็น DateTime
    const inputDate = DateTime.fromISO(dateString); // วันที่รับเข้ามาเป็น DateTime
  
    // คำนวณจำนวนวันที่ต่างจาก startDate แล้ว +1 เพื่อให้เริ่มจากวันแรก
    const dayOfWeek = inputDate.diff(startDate, "days").days + 1;
  
    return dayOfWeek;
  } 

  async getDateToShow(dayOfWeek) {
    const startDateStr = await this.getStartDate(); // ดึงวันที่เริ่มต้นจากฐานข้อมูล
    const startDate = DateTime.fromISO(startDateStr); // แปลงเป็น DateTime
  
    // คำนวณวันที่จาก day_of_week โดยเริ่มจาก startDate
    const dateToShow = startDate.plus({ days: dayOfWeek - 1 });
  
    return dateToShow.toISO(); // ส่งคืนวันที่ในรูปแบบ ISO
  }
  

  async getMenusByDay({ params, response }) {
    try {
      const { date } = params; // รับค่าจาก URL params
      const dayOfWeek = await this.getDayOfWeekFromDate(date); // ใช้ await เพื่อรอผลลัพธ์จาก getDayOfWeekFromDate
  
      // ตรวจสอบค่า dayOfWeek ที่ได้
      if (!dayOfWeek) {
        return response.status(400).json({ message: "Invalid day_of_week" });
      }
  
      // ค้นหาข้อมูลจากฐานข้อมูล
      const menus = await SetupMenuPh.query()
        .where("day_of_week", dayOfWeek) // ค้นหาข้อมูลที่มี day_of_week ตรงกัน
        .orderBy("day_of_week", "asc") // เรียงตาม day_of_week
        .fetch();
  
      if (menus.rows.length === 0) {
        return response.status(404).json({ message: "No menus found for this day" });
      }
  
      return response.json({ date, menus: menus.toJSON() });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Something went wrong", error });
    }
  }
  

  //   // การตรวจสอบคำขอในเซิร์ฟเวอร์ AdonisJS
  //   async getMenusByToDay({ params, response }) {
  //     try {
  //       const { dayOfWeek } = params; // รับค่า day_of_week จาก URL params
  //       const menus = await SetupMenuPh.query().where('day_of_week', dayOfWeek).fetch();

  //       if (menus.rows.length === 0) {
  //         return response.status(404).json({ message: 'No menus found for this day' });
  //       }

  //       return response.json({ menus: menus.toJSON() }); // ส่งกลับข้อมูลเมนู
  //     } catch (error) {
  //       console.error(error);
  //       return response.status(500).json({ message: 'Something went wrong', error: error.message });
  //     }
  //   }
}

module.exports = SetupMenuPhController;
