"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class CustomerHhb extends Model {
  static get table() {
    return "customers_hhbs";
  }

  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = CustomerHhb;
