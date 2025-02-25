"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class CustomerHhb extends Model {
  static get table() {
    return "customers_hhbs";
  }

  salesRecords() {
    return this.hasMany("App/Models/SaleRecordHhb", "customer_id", "customer_id"); // ใช้ customer_id ที่เป็น string
  }

  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = CustomerHhb;
