"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StartDateToSetupMenuSchema extends Schema {
  up() {
    this.create("start_date_to_setup_menus", (table) => {
      table.increments();
      table.string("key").unique(); // เก็บชื่อค่า เช่น 'start_date'
      table.string("value"); // เก็บค่าที่กำหนด
      table.timestamps();
    });
  }

  down() {
    this.drop("start_date_to_setup_menus");
  }
}

module.exports = StartDateToSetupMenuSchema;
