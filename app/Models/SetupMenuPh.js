"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class SetupMenuPh extends Model {
  static get table() {
    return "setup_menus_phs"; // ต้องตรงกับชื่อของตารางในฐานข้อมูล
  }

  menu() {
    return this.belongsTo("App/Models/Menu");
  }
}

module.exports = SetupMenuPh;
