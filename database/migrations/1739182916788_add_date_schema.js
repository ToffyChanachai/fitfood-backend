"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddDateSchema extends Schema {
  up() {
    this.table("orders_phs", (table) => {
      table.date("date").nullable();
    });
  }

  down() {
    this.table("orders_phs", (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddDateSchema;
