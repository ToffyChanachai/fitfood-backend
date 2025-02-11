"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class TestCustomer extends Model {
  static get table() {
    return "test_customers";
  }

  // กำหนดความสัมพันธ์ของโมเดล Customer กับ User
  // user() {
  //   return this.belongsTo("App/Models/User"); 
  // }
}

module.exports = TestCustomer;
