"use strict";

const Model = use("Model");

class Customer extends Model {
  static get table() {
    return "customers";
  }

  // ความสัมพันธ์กับ SaleRecord
  salesRecords() {
    return this.hasMany("App/Models/SaleRecord", "customer_id", "customer_id"); // ใช้ customer_id ที่เป็น string
  }

  user() {
    return this.belongsTo("App/Models/User"); 
  }
}

module.exports = Customer;
