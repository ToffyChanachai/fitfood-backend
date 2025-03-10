"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddDeliveryCustomersSchema extends Schema {
  up() {
    this.table("customers_hhbs", (table) => {
      table.text("delivery_address");
      table.text("delivery_round");
      table.text("deliver");
      table.text("delivery_zone");
      // table.time("delivery_time").nullable();
    });
  }

  down() {
    this.table("customers_hhbs", (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddDeliveryCustomersSchema;
