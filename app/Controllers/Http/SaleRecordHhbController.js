const { DateTime } = require("luxon");
const Customer = use("App/Models/CustomerHhb");
const Package = use("App/Models/Package");
const ZoneDelivery = use("App/Models/ZoneDelivery");
const SaleRecordHhb = use("App/Models/SaleRecordHhb");
const Database = use("Database");

class SaleRecordHhbController {
  async store({ request, response }) {
    const saleData = request.only([
      "customer_id",
      "promotion_type_id",
      "program_id",
      "package_id",
      "package_type_id",
      "seller_name_id",
      "package_price",
      "discount",
      "extra_charge",
      "extra_charge_price",
      "payment_status",
      "paid_date",
      "payment_type_id",
      "start_package_date",
      "zone1_id",
      "zone1_quantity",
      "zone2_id",
      "zone2_quantity",
      "zone3_id",
      "zone3_quantity",
      "zone_outsource_id",
      "zone_outsource_quantity",
      "add_detail",
      "add_price",
      "additional_type_id",
      "receive_food_id",
      "select_food_id",
      "delivery_round_id",
      "note",
      "free_mad",
      "free_dessert",
      "free_brittles",
      "free_energy_balls",
      "free_dressing",
      "free_yoghurt",
      "free_granola",
      "free_credit",
      "other_promotion_detail",
    ]);

    try {
      const customer = await Customer.find(saleData.customer_id);
      if (!customer) {
        return response.status(404).json({ message: "Customer not found" });
      }

      saleData.promotion_type_id = saleData.promotion_type_id || null;
      saleData.program_id = saleData.program_id || null;
      saleData.package_id = saleData.package_id || null;
      saleData.start_package_date = saleData.start_package_date || null;

      if (saleData.package_id) {
        const packageData = await Package.find(saleData.package_id);
        if (!packageData) {
          saleData.package_price = 0;
          saleData.expiry_date = null;
          saleData.remaining_days = 0;
        } else {
          // บวกจำนวนที่แถมจาก saleData กับ packageData
          saleData.mad =
            (packageData.total_boxes || 0) +
            (packageData.free_mad || 0) +
            (saleData.free_mad || 0);
          saleData.dessert =
            (packageData.free_dessert || 0) + (saleData.free_dessert || 0);
          saleData.brittles =
            (packageData.free_brittles || 0) + (saleData.free_brittles || 0);
          saleData.energy_balls =
            (packageData.free_energy_balls || 0) +
            (saleData.free_energy_balls || 0);
          saleData.dressing =
            (packageData.free_dressing || 0) + (saleData.free_dressing || 0);
          saleData.yoghurt =
            (packageData.free_yoghurt || 0) + (saleData.free_yoghurt || 0);
          saleData.granola =
            (packageData.free_granola || 0) + (saleData.free_granola || 0);
          saleData.credit =
            (packageData.free_credit || 0) + (saleData.free_credit || 0);

          const price = parseFloat(packageData.price);
          const extraChargePercent = parseFloat(saleData.extra_charge || 0);
          const discount = parseFloat(saleData.discount || 0);
          const extraChargePrice = (price * extraChargePercent) / 100;
          saleData.extra_charge_price = extraChargePrice;

          saleData.package_price = price;
          saleData.total_package_price = price + extraChargePrice - discount;

          const startDate = DateTime.fromISO(saleData.start_package_date);
          const expiryDate = startDate.plus({
            days: packageData.package_validity,
          });
          const currentDate = DateTime.now();
          const remainingDays = expiryDate
            .diff(currentDate, "days")
            .toObject().days;

          saleData.expiry_date = expiryDate.toISODate();
          saleData.remaining_days = Math.ceil(remainingDays);
          saleData.total_boxes =
            (saleData.mad || 0) +
            (saleData.dessert || 0) +
            (saleData.brittles || 0) +
            (saleData.energy_balls || 0) +
            (saleData.dressing || 0) +
            (saleData.yoghurt || 0) +
            (saleData.granola || 0);

          saleData.total_boxes_show =
            (saleData.mad || 0) +
            (saleData.dessert || 0) +
            (saleData.brittles || 0) +
            (saleData.energy_balls || 0) +
            (saleData.dressing || 0) +
            (saleData.yoghurt || 0) +
            (saleData.granola || 0);
        }
      } else {
        const addPrice = parseFloat(saleData.add_price || 0);
        const extraChargePercent = parseFloat(saleData.extra_charge || 0);
        const discount = parseFloat(saleData.discount || 0);

        const extraChargePrice = (addPrice * extraChargePercent) / 100;
        saleData.extra_charge_price = extraChargePrice;
        saleData.total_package_price = addPrice + extraChargePrice - discount;

        const startDate = DateTime.now(); // ใช้วันนี้เป็นวันเริ่มต้น

        // กำหนดวันที่หมดอายุ (Expiry Date) เป็น 30 วันจากวันนี้
        const expiryDate = startDate.plus({ days: 30 });
        const currentDate = DateTime.now(); // วันที่ปัจจุบัน

        // คำนวณจำนวนวันที่เหลือ
        const remainingDays = expiryDate
          .diff(currentDate, "days")
          .toObject().days;

        // กำหนดค่า expiry_date และ remaining_days
        saleData.expiry_date = expiryDate.toISODate(); // ให้เป็นรูปแบบวันที่
        saleData.remaining_days = Math.ceil(remainingDays);
        saleData.total_boxes = 1;
      }

      // คำนวณราคาจากโซนต่าง ๆ (zone1, zone2, zone3, zoneOutsource)
      let totalZone1Price = 0;
      let zone1Quantity = parseInt(saleData.zone1_quantity, 10) || 0;
      if (saleData.zone1_id) {
        const zone1 = await ZoneDelivery.find(saleData.zone1_id);
        if (zone1) {
          const zone1Price = parseFloat(zone1.price) || 0;
          totalZone1Price = zone1Price * zone1Quantity;
        }
      }
      saleData.total_zone1_price = totalZone1Price;

      let totalZone2Price = 0;
      let zone2Quantity = parseInt(saleData.zone2_quantity, 10) || 0;
      if (saleData.zone2_id) {
        const zone2 = await ZoneDelivery.find(saleData.zone2_id);
        if (zone2) {
          const zone2Price = parseFloat(zone2.price) || 0;
          totalZone2Price = zone2Price * zone2Quantity;
        }
      }
      saleData.total_zone2_price = totalZone2Price;

      let totalZone3Price = 0;
      let zone3Quantity = parseInt(saleData.zone3_quantity, 10) || 0;
      if (saleData.zone3_id) {
        const zone3 = await ZoneDelivery.find(saleData.zone3_id);
        if (zone3) {
          const zone3Price = parseFloat(zone3.price) || 0;
          totalZone3Price = zone3Price * zone3Quantity;
        }
      }
      saleData.total_zone3_price = totalZone3Price;

      let totalZoneOutsourcePrice = 0;
      let zoneOutsourceQuantity =
        parseInt(saleData.zone_outsource_quantity, 10) || 0;
      if (saleData.zone_outsource_id) {
        const zoneOutsource = await ZoneDelivery.find(
          saleData.zone_outsource_id
        );
        if (zoneOutsource) {
          const zoneOutsourcePrice = parseFloat(zoneOutsource.price) || 0;
          totalZoneOutsourcePrice = zoneOutsourcePrice * zoneOutsourceQuantity;
        }
      }
      saleData.total_zone_outsource_price = totalZoneOutsourcePrice;

      // คำนวณราคาทั้งหมด
      let totalDeliveryPrice =
        totalZone1Price +
        totalZone2Price +
        totalZone3Price +
        totalZoneOutsourcePrice;
      saleData.total_delivery_price = totalDeliveryPrice;

      let totalPrice =
        saleData.total_package_price + saleData.total_delivery_price;
      saleData.total_price = totalPrice;

      let transactionNumber = null;

      // คำนวณปีและเดือนปัจจุบัน
      const currentYear = new Date().getFullYear().toString().slice(-2); // ดึงปีล่าสุด 2 หลัก (เช่น 25 จาก 2025)
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

      let prefix = "";
      switch (saleData.package_type_id) {
        case 2:
          prefix = "HA";
          break;
        case 3:
        case 4:
          prefix = "HB";
          break;
        case 5:
        case 6:
          prefix = "HC";
          break;
        default:
          prefix = "HA"; // กำหนดค่าเริ่มต้นหากไม่มีการกำหนด
          break;
      }

      // ค้นหาหมายเลข transaction ล่าสุดจากตาราง SaleRecordHhb ตาม prefix
      const lastSaleRecord = await SaleRecordHhb.query()
        .where("transaction", "like", `${prefix}${currentYear}${currentMonth}%`) // ค้นหาตาม prefix, ปี และ เดือน
        .orderBy("transaction", "desc")
        .first();

      if (lastSaleRecord) {
        const lastTransaction = lastSaleRecord.transaction;
        const lastYear = lastTransaction.slice(2, 4); // ดึงปีจากหมายเลข transaction (เช่น 25 จาก AA25)
        const lastMonth = lastTransaction.slice(4, 6); // ดึงเดือนจากหมายเลข transaction (เช่น 03 จาก AA2503)

        if (lastYear !== currentYear || lastMonth !== currentMonth) {
          transactionNumber = `${prefix}${currentYear}${currentMonth}0001`;
        } else {
          const lastTransactionNumber = lastTransaction.slice(7); // ดึงหมายเลข 4 หลักจากส่วนที่เหลือ
          const newTransactionNumber = parseInt(lastTransactionNumber) + 1;
          transactionNumber = `${prefix}${currentYear}${currentMonth}${String(
            newTransactionNumber
          ).padStart(4, "0")}`;
        }
      } else {
        // ถ้าไม่มีการบันทึกเลย ให้เริ่มจาก 0001
        transactionNumber = `${prefix}${currentYear}${currentMonth}0001`;
      }

      saleData.transaction = transactionNumber;
      // บันทึกข้อมูลการขาย
      const saleRecord = await SaleRecordHhb.create(saleData);

      return response.status(201).json({
        message: "บันทึกการขายสำเร็จ",
        data: saleRecord,
      });
    } catch (error) {
      console.error("Error creating sale record:", error);
      return response.status(500).json({
        message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        error: error.message,
      });
    }
  }

  async index({ auth, request, response }) {
    try {
      const user = await auth.getUser(); // ดึงข้อมูล user ที่ล็อกอินอยู่
  
      // ถ้าเป็น customer ให้ดึงข้อมูลเฉพาะของตัวเอง
      const customer = await Customer.query().where("user_id", user.id).first();
  
      if (!customer) {
        return response.status(404).json({
          message: "ไม่พบข้อมูลลูกค้าสำหรับบัญชีของคุณ",
        });
      }
  
      const customerId = customer.id; // ใช้ customer.id แทน customer_id
      const month = request.input("month"); // รับค่าเดือนจาก query parameter เช่น ?month=2025-03
  
      let query = SaleRecordHhb.query()
        .with("customer")
        .with("promotionType")
        .with("program")
        .with("package");
  
      // ถ้ามีการส่งค่าเดือนเข้ามา ให้กรองข้อมูลตามเดือน
      if (month) {
        query = query.whereRaw("TO_CHAR(created_at, 'YYYY-MM') = ?", [month]);
      }
  
      // ถ้าเป็น admin ให้ดึงข้อมูลทั้งหมด
      if (user.role === "admin") {
        const saleRecords = await query.fetch();
        return response.status(200).json(saleRecords);
      } else {
        // ถ้าเป็น customer ให้ดึงข้อมูลเฉพาะของตัวเอง
        const saleRecords = await query.where("customer_id", customerId).fetch();
        return response.status(200).json(saleRecords);
      }
    } catch (error) {
      console.error("Error fetching sale records:", error);
      return response
        .status(500)
        .json({ message: "Error fetching sale records", error: error.message });
    }
  }

  async update({ params, request, response }) {
    const saleRecordId = params.id;
    const saleData = request.only([
      "customer_id",
      "promotion_type_id",
      "program_id",
      "package_id",
      "package_type_id",
      "seller_name_id",
      "package_price",
      "discount",
      "extra_charge",
      "extra_charge_price",
      "payment_status",
      "paid_date",
      "payment_type_id",
      "start_package_date",
      "zone1_id",
      "zone1_quantity",
      "zone2_id",
      "zone2_quantity",
      "zone3_id",
      "zone3_quantity",
      "zone_outsource_id",
      "zone_outsource_quantity",
      "add_detail",
      "add_price",
      "additional_type_id",
      "receive_food_id",
      "select_food_id",
      "delivery_round_id",
      "note",
      "free_mad",
      "free_dessert",
      "free_brittles",
      "free_energy_balls",
      "free_dressing",
      "free_yoghurt",
      "free_granola",
      "free_credit",
      "other_promotion_detail",
    ]);

    try {
      // 🛑 ค้นหา SaleRecord ก่อน
      const saleRecord = await SaleRecordHhb.find(saleRecordId);
      if (!saleRecord) {
        return response.status(404).json({ message: "ไม่พบข้อมูลการขาย" });
      }

      // 🛠 ตรวจสอบว่ามี Customer หรือไม่
      const customer = await Customer.find(saleData.customer_id);
      if (!customer) {
        return response.status(404).json({ message: "ไม่พบข้อมูลลูกค้า" });
      }

      // 🏷 ตั้งค่าเริ่มต้น
      saleData.promotion_type_id = saleData.promotion_type_id || null;
      saleData.program_id = saleData.program_id || null;
      saleData.package_id = saleData.package_id || null;
      saleData.start_package_date = saleData.start_package_date || null;

      // 📦 คำนวณราคา Package
      if (saleData.package_id) {
        const packageData = await Package.find(saleData.package_id);
        if (!packageData) {
          saleData.package_price = 0;
          saleData.expiry_date = null;
          saleData.remaining_days = 0;
        } else {
          saleData.mad =
            (packageData.total_boxes || 0) +
            (packageData.free_mad || 0) +
            (saleData.free_mad || 0);
          saleData.dessert =
            (packageData.free_dessert || 0) + (saleData.free_dessert || 0);
          saleData.brittles =
            (packageData.free_brittles || 0) + (saleData.free_brittles || 0);
          saleData.energy_balls =
            (packageData.free_energy_balls || 0) +
            (saleData.free_energy_balls || 0);
          saleData.dressing =
            (packageData.free_dressing || 0) + (saleData.free_dressing || 0);
          saleData.yoghurt =
            (packageData.free_yoghurt || 0) + (saleData.free_yoghurt || 0);
          saleData.granola =
            (packageData.free_granola || 0) + (saleData.free_granola || 0);
          saleData.credit =
            (packageData.free_credit || 0) + (saleData.free_credit || 0);

          const price = parseFloat(packageData.price);
          const extraChargePercent = parseFloat(saleData.extra_charge || 0);
          const discount = parseFloat(saleData.discount || 0);
          const extraChargePrice = (price * extraChargePercent) / 100;
          saleData.extra_charge_price = extraChargePrice;
          saleData.package_price = price;
          saleData.total_package_price = price + extraChargePrice - discount;

          const startDate = DateTime.fromISO(saleData.start_package_date);
          const expiryDate = startDate.plus({
            days: packageData.package_validity,
          });
          const currentDate = DateTime.now();
          const remainingDays = expiryDate
            .diff(currentDate, "days")
            .toObject().days;

          saleData.expiry_date = expiryDate.toISODate();
          saleData.remaining_days = Math.ceil(remainingDays);
          saleData.total_boxes =
            (saleData.mad || 0) +
            (saleData.dessert || 0) +
            (saleData.brittles || 0) +
            (saleData.energy_balls || 0) +
            (saleData.dressing || 0) +
            (saleData.yoghurt || 0) +
            (saleData.granola || 0);

          saleData.total_boxes_show =
            (saleData.mad || 0) +
            (saleData.dessert || 0) +
            (saleData.brittles || 0) +
            (saleData.energy_balls || 0) +
            (saleData.dressing || 0) +
            (saleData.yoghurt || 0) +
            (saleData.granola || 0);
        }
      } else {
        const addPrice = parseFloat(saleData.add_price || 0);
        const extraChargePercent = parseFloat(saleData.extra_charge || 0);
        const discount = parseFloat(saleData.discount || 0);

        const extraChargePrice = (addPrice * extraChargePercent) / 100;
        saleData.extra_charge_price = extraChargePrice;
        saleData.total_package_price = addPrice + extraChargePrice - discount;

        const startDate = DateTime.now(); // ใช้วันนี้เป็นวันเริ่มต้น

        // กำหนดวันที่หมดอายุ (Expiry Date) เป็น 30 วันจากวันนี้
        const expiryDate = startDate.plus({ days: 30 });
        const currentDate = DateTime.now(); // วันที่ปัจจุบัน

        // คำนวณจำนวนวันที่เหลือ
        const remainingDays = expiryDate
          .diff(currentDate, "days")
          .toObject().days;

        // กำหนดค่า expiry_date และ remaining_days
        saleData.expiry_date = expiryDate.toISODate(); // ให้เป็นรูปแบบวันที่
        saleData.remaining_days = Math.ceil(remainingDays);
        saleData.total_boxes = 1;
      }

      // 🚚 คำนวณราคาการจัดส่ง (Zone)
      const calculateZonePrice = async (zoneId, zoneQuantity) => {
        let zonePrice = 0;
        if (zoneId) {
          const zone = await ZoneDelivery.find(zoneId);
          if (zone) {
            zonePrice = parseFloat(zone.price) || 0;
          }
        }
        return zonePrice * (parseInt(zoneQuantity, 10) || 0);
      };

      saleData.total_zone1_price = await calculateZonePrice(
        saleData.zone1_id,
        saleData.zone1_quantity
      );
      saleData.total_zone2_price = await calculateZonePrice(
        saleData.zone2_id,
        saleData.zone2_quantity
      );
      saleData.total_zone3_price = await calculateZonePrice(
        saleData.zone3_id,
        saleData.zone3_quantity
      );
      saleData.total_zone_outsource_price = await calculateZonePrice(
        saleData.zone_outsource_id,
        saleData.zone_outsource_quantity
      );

      // 🎯 คำนวณราคารวม
      saleData.total_delivery_zone_price =
        saleData.total_zone1_price +
        saleData.total_zone2_price +
        saleData.total_zone3_price;
      saleData.total_delivery_price =
        saleData.total_delivery_zone_price +
        saleData.total_zone_outsource_price;
      saleData.total_price =
        saleData.total_package_price + saleData.total_delivery_price;

      // let transactionNumber = null;

      // // คำนวณปีและเดือนปัจจุบัน
      // const currentYear = new Date().getFullYear().toString().slice(-2); // ดึงปีล่าสุด 2 หลัก (เช่น 25 จาก 2025)
      // const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

      // let prefix = "";
      // switch (saleData.package_type_id) {
      //   case 2:
      //     prefix = "HA";
      //     break;
      //   case 3:
      //   case 4:
      //     prefix = "HB";
      //     break;
      //   case 5:
      //   case 6:
      //     prefix = "HC";
      //     break;
      //   default:
      //     prefix = "HA"; // กำหนดค่าเริ่มต้นหากไม่มีการกำหนด
      //     break;
      // }

      // // ค้นหาหมายเลข transaction ล่าสุดจากตาราง SaleRecordHhb ตาม prefix
      // const lastSaleRecord = await SaleRecordHhb.query()
      //   .where("transaction", "like", `${prefix}${currentYear}${currentMonth}%`) // ค้นหาตาม prefix, ปี และ เดือน
      //   .orderBy("transaction", "desc")
      //   .first();

      // if (lastSaleRecord) {
      //   const lastTransaction = lastSaleRecord.transaction;
      //   const lastYear = lastTransaction.slice(2, 4); // ดึงปีจากหมายเลข transaction (เช่น 25 จาก AA25)
      //   const lastMonth = lastTransaction.slice(4, 6); // ดึงเดือนจากหมายเลข transaction (เช่น 03 จาก AA2503)

      //   if (lastYear !== currentYear || lastMonth !== currentMonth) {
      //     transactionNumber = `${prefix}${currentYear}${currentMonth}0001`;
      //   } else {
      //     const lastTransactionNumber = lastTransaction.slice(7); // ดึงหมายเลข 4 หลักจากส่วนที่เหลือ
      //     const newTransactionNumber = parseInt(lastTransactionNumber) + 1;
      //     transactionNumber = `${prefix}${currentYear}${currentMonth}${String(
      //       newTransactionNumber
      //     ).padStart(4, "0")}`;
      //   }
      // } else {
      //   // ถ้าไม่มีการบันทึกเลย ให้เริ่มจาก 0001
      //   transactionNumber = `${prefix}${currentYear}${currentMonth}0001`;
      // }

      // saleData.transaction = transactionNumber;

      // 📝 อัปเดตข้อมูล SaleRecord
      saleRecord.merge(saleData);

      // ตรวจสอบการอัปเดตสถานะการชำระเงิน
      if (saleData.payment_status) {
        if (saleData.payment_status === "unpaid") {
          saleRecord.paid_date = null;
          saleRecord.payment_type_id = null;
        } else if (saleData.payment_status === "paid") {
          saleRecord.paid_date = saleData.paid_date || null;
          saleRecord.payment_type_id = saleData.payment_type_id || null;
        }
      }

      await saleRecord.save();

      return response.status(200).json({
        message: "อัปเดตข้อมูลการขายสำเร็จ",
        data: saleRecord,
      });
    } catch (error) {
      console.error("Error updating sale record:", error);
      return response.status(500).json({
        message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
        error: error.message,
      });
    }
  }

  async updatePaymentStatus({ params, request, response }) {
    const { payment_status, paid_date, payment_type_id } = request.only([
      "payment_status",
      "paid_date",
      "payment_type_id", // เพิ่ม payment_type_id
    ]);

    try {
      // ค้นหาบันทึกยอดขายจาก ID
      const saleRecord = await SaleRecordHhb.find(params.id);
      if (!saleRecord) {
        return response
          .status(404)
          .json({ message: "ไม่พบข้อมูลบันทึกยอดขาย" });
      }

      if (payment_status === "unpaid") {
        saleRecord.paid_date = null;
        saleRecord.payment_type_id = null;
      } else if (payment_status === "paid") {
        saleRecord.paid_date = paid_date;
        saleRecord.payment_type_id = payment_type_id;
      }

      saleRecord.payment_status = payment_status; // อัพเดทสถานะการชำระเงิน
      saleRecord.payment_type_id = payment_type_id; // อัพเดทประเภทการชำระเงิน

      // บันทึกการเปลี่ยนแปลง
      await saleRecord.save();

      return response.status(200).json({
        message: "อัพเดทสถานะการชำระเงินสำเร็จ",
        data: saleRecord,
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัพเดทสถานะการชำระเงิน:", error);
      return response.status(500).json({
        message: "เกิดข้อผิดพลาดในการอัพเดทสถานะการชำระเงิน",
        error: error.message,
      });
    }
  }

  async updateDelivery({ params, request, response }) {
    const { delivery_round, deliver, delivery_zone } = request.only([
      "delivery_round",
      "deliver",
      "delivery_zone",
    ]);

    try {
      const saleRecord = await SaleRecordHhb.find(params.id);
      if (!saleRecord) {
        return response.status(404).json({ message: "ไม่พบข้อมูลการขาย" });
      }

      // 🛠 อัปเดตข้อมูลการจัดส่ง
      saleRecord.delivery_round = delivery_round || null; // อัปเดตรอบการจัดส่ง
      saleRecord.deliver = deliver || null; // อัปเดตการจัดส่ง
      saleRecord.delivery_zone = delivery_zone || null; // อัปเดตพื้นที่จัดส่ง

      // 📝 บันทึกข้อมูลที่อัปเดต
      await saleRecord.save();

      return response.status(200).json({
        message: "อัปเดตข้อมูลการจัดส่งสำเร็จ",
        data: saleRecord,
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลการจัดส่ง:", error);
      return response.status(500).json({
        message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลการจัดส่ง",
        error: error.message,
      });
    }
  }

  async deleteSaleRecord({ params, response }) {
    try {
      const saleRecord = await SaleRecordHhb.find(params.id);

      if (!saleRecord) {
        return response.status(404).json({ message: "Sale record not found" });
      }

      await saleRecord.delete();
      return response
        .status(200)
        .json({ message: "Sale record deleted successfully" });
    } catch (error) {
      console.error("Error deleting sale record:", error);
      return response
        .status(500)
        .json({ message: "Error deleting sale record", error: error.message });
    }
  }

  async getDailySales({ request, response }) {
    try {
      const { startDate, endDate } = request.get();

      // ตั้งค่า default สำหรับวันที่เริ่มต้นและสิ้นสุด ถ้าไม่มีการส่งค่ามา
      const selectedStartDate =
        startDate || DateTime.local().toFormat("yyyy-MM-dd");
      const selectedEndDate =
        endDate || DateTime.local().toFormat("yyyy-MM-dd");

      const VAT_RATE = 0.07;

      // ดึงข้อมูลยอดขายตามช่วงวันที่
      const dailySales = await Database.from("sale_records_hhbs")
        .where("payment_status", "paid")
        .whereBetween("paid_date", [selectedStartDate, selectedEndDate])
        .select("*");

      const dailySalesWithPreVAT = dailySales.map((sale) => {
        const preVAT = sale.total_price / (1 + VAT_RATE);
        const packagePreVAT = sale.total_package_price / (1 + VAT_RATE);
        const deliveryPreVAT = sale.total_delivery_price / (1 + VAT_RATE);
        return {
          ...sale,
          pre_vat: preVAT.toFixed(2),
          package_pre_vat: packagePreVAT.toFixed(2),
          delivery_pre_vat: deliveryPreVAT.toFixed(2),
        };
      });

      // คำนวณยอดขายรวม (รวม VAT)
      const totalSales = await Database.from("sale_records_hhbs")
        .where("payment_status", "paid")
        .whereBetween("paid_date", [selectedStartDate, selectedEndDate])
        .sum("total_price as total");

      const totalSalesBeforeVAT = totalSales[0]?.total / (1 + VAT_RATE) || 0;

      // คำนวณยอดรวมของราคาสินค้า (package price)
      const totalPackage = await Database.from("sale_records_hhbs")
        .where("payment_status", "paid")
        .whereBetween("paid_date", [selectedStartDate, selectedEndDate])
        .sum("total_package_price as package");

      const totalPackageBeforeVAT =
        totalPackage[0]?.package / (1 + VAT_RATE) || 0;

      // คำนวณยอดรวมของค่าขนส่ง (delivery price)
      const totalDelivery = await Database.from("sale_records_hhbs")
        .where("payment_status", "paid")
        .whereBetween("paid_date", [selectedStartDate, selectedEndDate])
        .sum("total_delivery_price as delivery");

      const totalDeliveryBeforeVAT =
        totalDelivery[0]?.delivery / (1 + VAT_RATE) || 0;

      // คำนวณยอดขายแยกตามประเภทการชำระเงิน (payment_type_id)
      const salesByPaymentType = await Database.from("sale_records_hhbs")
        .where("payment_status", "paid")
        .whereBetween("paid_date", [selectedStartDate, selectedEndDate])
        .groupBy("payment_type_id")
        .sum("total_price as total_sales")
        .select("payment_type_id");

      const salesByPaymentTypeWithPreVAT = salesByPaymentType.map((sale) => {
        const preVAT = sale.total_sales / (1 + VAT_RATE);
        return {
          payment_type_id: sale.payment_type_id,
          total_sales: sale.total_sales,
          pre_vat: preVAT.toFixed(2),
        };
      });

      // คำนวณยอดขายแยกตามผู้ขาย (seller_name_id) และประเภทสินค้า (package_type_id)
      const salesBySellerAndPackageType = await Database.from(
        "sale_records_hhbs"
      )
        .where("payment_status", "paid")
        .whereBetween("paid_date", [selectedStartDate, selectedEndDate])
        .groupBy("seller_name_id", "package_type_id")
        .sum("total_package_price as total_sales")
        .select("seller_name_id", "package_type_id");

      // คำนวณยอดขายก่อน VAT (Pre-VAT)
      const salesBySellerAndPackageTypeWithPreVAT =
        salesBySellerAndPackageType.map((sale) => {
          const preVAT = sale.total_sales / (1 + VAT_RATE);
          return {
            seller_name_id: sale.seller_name_id,
            package_type_id: sale.package_type_id,
            total_sales: sale.total_sales,
            pre_vat: preVAT.toFixed(2),
          };
        });

      // // ผลรวมของแต่ละ seller
      // const salesBySellerTotal = salesBySellerAndPackageTypeWithPreVAT.reduce(
      //   (acc, sale) => {
      //     if (!acc[sale.seller_name_id]) {
      //       acc[sale.seller_name_id] = {
      //         total_sales: 0,
      //         pre_vat: 0,
      //       };
      //     }

      //     // แปลง total_sales และ pre_vat เป็นตัวเลขก่อนทำการคำนวณ
      //     acc[sale.seller_name_id].total_sales += parseFloat(sale.total_sales); // แปลงเป็นตัวเลข
      //     acc[sale.seller_name_id].pre_vat += parseFloat(sale.pre_vat); // แปลงเป็นตัวเลข

      //     return acc;
      //   },
      //   {}
      // );

      // // รวมข้อมูลจาก salesBySellerAndPackageType กับ salesBySellerTotal
      // const combinedSalesData = salesBySellerAndPackageTypeWithPreVAT.map(
      //   (sale) => {
      //     const sellerTotal = salesBySellerTotal[sale.seller_name_id];

      //     // เพิ่มข้อมูลผลรวมเข้าไปในแต่ละรายการ
      //     return {
      //       ...sale, // ข้อมูลเดิม
      //       seller_total_sales: sellerTotal.total_sales.toFixed(2),
      //       seller_pre_vat: sellerTotal.pre_vat.toFixed(2),
      //     };
      //   }
      // );

      // console.log(combinedSalesData);

      // คำนวณยอดรวมของแต่ละ seller
      const salesBySellerGrouped = salesBySellerAndPackageTypeWithPreVAT.reduce(
        (acc, sale) => {
          if (!acc[sale.seller_name_id]) {
            acc[sale.seller_name_id] = {
              seller_name_id: sale.seller_name_id,
              sales: [], // เก็บข้อมูลตาม package_type_id
              seller_total_sales: 0, // เก็บยอดรวมของ seller สำหรับ total_sales
              seller_total_pre_vat: 0, // เก็บยอดรวมของ seller สำหรับ pre_vat
            };
          }

          // เพิ่มข้อมูล package_type_id และคำนวณยอดขายรวม
          acc[sale.seller_name_id].sales.push({
            package_type_id: sale.package_type_id,
            total_sales: sale.total_sales,
            pre_vat: sale.pre_vat,
          });

          // คำนวณยอดขายรวม
          acc[sale.seller_name_id].seller_total_sales += parseFloat(
            sale.total_sales
          ); // เพิ่มยอดรวมสำหรับ total_sales
          acc[sale.seller_name_id].seller_total_pre_vat += parseFloat(
            sale.pre_vat
          ); // เพิ่มยอดรวมสำหรับ pre_vat

          return acc;
        },
        {}
      );

      // แปลงให้เป็น array เพื่อใช้ในการแสดงผลใน table
      //salesBySellerAndPackageType = Object.values(salesBySellerGrouped);

      return response.status(200).send({
        message: `ดึงข้อมูลยอดขายตั้งแต่ ${selectedStartDate} ถึง ${selectedEndDate} สำเร็จ`,
        data: {
          dailySales: dailySalesWithPreVAT,
          totalSales: totalSales[0]?.total || 0,
          totalSalesBeforeVAT: totalSalesBeforeVAT.toFixed(2),
          totalPackage: totalPackage[0]?.package || 0,
          totalPackageBeforeVAT: totalPackageBeforeVAT.toFixed(2),
          totalDelivery: totalDelivery[0]?.delivery || 0,
          totalDeliveryBeforeVAT: totalDeliveryBeforeVAT.toFixed(2),
          salesByPaymentType: salesByPaymentTypeWithPreVAT,
          salesBySellerAndPackageType: salesBySellerGrouped,
        },
      });
    } catch (error) {
      console.error("Error retrieving sales data:", error);
      return response.status(500).send({
        message: "ดึงข้อมูลยอดขายไม่สำเร็จ",
        error: error.message,
      });
    }
  }

  async getAllSales({ response }) {
    try {
      const VAT_RATE = 0.07;

      // ดึงข้อมูลยอดขายทั้งหมด (ไม่มีช่วงเวลา)
      const allSales = await Database.from("sale_records_hhbs")
        .where("payment_status", "paid")
        .select("*");

      const allSalesWithPreVAT = allSales.map((sale) => {
        return {
          ...sale,
          pre_vat: (sale.total_price / (1 + VAT_RATE)).toFixed(2),
          package_pre_vat: (sale.total_package_price / (1 + VAT_RATE)).toFixed(
            2
          ),
          delivery_pre_vat: (
            sale.total_delivery_price /
            (1 + VAT_RATE)
          ).toFixed(2),
        };
      });

      // คำนวณยอดขายรวม (รวม VAT)
      const totalSales = await Database.from("sale_records_hhbs")
        .where("payment_status", "paid")
        .sum("total_price as total");

      const totalSalesBeforeVAT = totalSales[0]?.total / (1 + VAT_RATE) || 0;

      // คำนวณยอดรวมของราคาสินค้า (package price)
      const totalPackage = await Database.from("sale_records_hhbs")
        .where("payment_status", "paid")
        .sum("total_package_price as package");

      const totalPackageBeforeVAT =
        totalPackage[0]?.package / (1 + VAT_RATE) || 0;

      // คำนวณยอดรวมของค่าขนส่ง (delivery price)
      const totalDelivery = await Database.from("sale_records_hhbs")
        .where("payment_status", "paid")
        .sum("total_delivery_price as delivery");

      const totalDeliveryBeforeVAT =
        totalDelivery[0]?.delivery / (1 + VAT_RATE) || 0;

      return response.status(200).send({
        message: "ดึงข้อมูลยอดขายทั้งหมดสำเร็จ",
        data: {
          allSales: allSalesWithPreVAT,
          totalSales: totalSales[0]?.total || 0,
          totalSalesBeforeVAT: totalSalesBeforeVAT.toFixed(2),
          totalPackage: totalPackage[0]?.package || 0,
          totalPackageBeforeVAT: totalPackageBeforeVAT.toFixed(2),
          totalDelivery: totalDelivery[0]?.delivery || 0,
          totalDeliveryBeforeVAT: totalDeliveryBeforeVAT.toFixed(2),
        },
      });
    } catch (error) {
      console.error("Error retrieving all sales data:", error);
      return response.status(500).send({
        message: "ดึงข้อมูลยอดขายทั้งหมดไม่สำเร็จ",
        error: error.message,
      });
    }
  }

  async getSaleRecordsByCustomerId({ params, request, response }) {
    const { customer_id } = params; // รับ customer_id จากพารามิเตอร์ URL
    const { start_date, end_date } = request.all(); // รับวันที่เริ่มต้นและสิ้นสุดจากพารามิเตอร์ URL

    try {
      // กรองคำสั่งซื้อโดย customer_id และช่วงวันที่
      const query = SaleRecordHhb.query().where("customer_id", customer_id);

      if (start_date) {
        query.where("start_package_date", ">=", start_date); // กรองตั้งแต่วันที่เริ่มต้น
      }

      if (end_date) {
        query.where("start_package_date", "<=", end_date); // กรองจนถึงวันที่สิ้นสุด
      }

      const saleRecords = await query.fetch();

      if (saleRecords.rows.length === 0) {
        return response.status(404).json({
          message: "ไม่พบคำสั่งซื้อสำหรับลูกค้ารายนี้ในช่วงวันที่ที่ระบุ",
        });
      }

      return response.status(200).json({ saleRecords });
    } catch (error) {
      return response.status(500).json({
        message: "เกิดข้อผิดพลาดในการดึงประวัติการสั่งซื้อ",
        error: error.message,
      });
    }
  }

  async getSaleRecordsByUserId({ auth, request, response }) {
    const user = auth.user; // ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
    if (!user) {
      return response.status(401).json({
        message: "กรุณาเข้าสู่ระบบ",
      });
    }

    const { start_date, end_date } = request.all(); // รับช่วงวันที่จาก query params

    try {
      // ค้นหาข้อมูลลูกค้าโดยใช้ user_id ที่ล็อกอินอยู่
      const customer = await Customer.query().where("user_id", user.id).first();

      if (!customer) {
        return response.status(404).json({
          message: "ไม่พบข้อมูลลูกค้าสำหรับบัญชีของคุณ",
        });
      }

      const customerId = customer.id; // ใช้ customer.id แทน customer_id

      // ค้นหาประวัติการสั่งซื้อทั้งหมดที่มี customer_id เดียวกัน
      const query = SaleRecordHhb.query().where("customer_id", customerId);

      if (start_date) {
        query.where("start_package_date", ">=", start_date); // กรองตั้งแต่วันที่เริ่มต้น
      }

      if (end_date) {
        query.where("start_package_date", "<=", end_date); // กรองจนถึงวันที่สิ้นสุด
      }

      const saleRecords = await query.fetch();

      if (saleRecords.rows.length === 0) {
        return response.status(404).json({
          message:
            "ไม่พบประวัติการสั่งซื้อสำหรับลูกค้ารายนี้ในช่วงวันที่ที่ระบุ",
        });
      }

      return response.status(200).json({ saleRecords });
    } catch (error) {
      return response.status(500).json({
        message: "เกิดข้อผิดพลาดในการดึงประวัติการสั่งซื้อ",
        error: error.message,
      });
    }
  }

}

module.exports = SaleRecordHhbController;
