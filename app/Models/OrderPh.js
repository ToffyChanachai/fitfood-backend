"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class OrderPh extends Model {
  menu() {
    return this.belongsTo("App/Models/Menu");
  }

  static get table () {
    return 'orders_phs'  // ถ้าคุณใช้ชื่ออื่นในฐานข้อมูล
  }
}

module.exports = OrderPh;
