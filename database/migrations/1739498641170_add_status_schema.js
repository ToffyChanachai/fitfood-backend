"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddStatusSchema extends Schema {
  up() {
    this.table("orders", (table) => {
      table.enu('status', ['pending', 'confirm']).defaultTo('pending')    });
  }

  down() {
    this.table("orders", (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddStatusSchema;
