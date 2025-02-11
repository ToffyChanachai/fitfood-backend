"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PackagesSchema extends Schema {
  up() {
    this.create("packages", (table) => {
      table.increments();
      table.varchar("name").notNullable();
      table
        .integer("program_id")
        .unsigned()
        .references("id")
        .inTable("programs")
        .onDelete("CASCADE");
      table.text("package_detail");
      table.integer("package_validity").defaultTo(0);
      table.integer("total_days").defaultTo(0);
      table.integer("boxes_per_day").defaultTo(0);
      table.integer("total_boxes").defaultTo(0);
      table.decimal("price", 10, 2).defaultTo(0);
      table.text("promotion_detail");
      table.integer("free_credit").defaultTo(0);
      table.integer("free_mad").defaultTo(0);
      table.integer("free_dessert").defaultTo(0);
      table.integer("free_brittles").defaultTo(0);
      table.integer("free_energy_balls").defaultTo(0);
      table.integer("free_dressing").defaultTo(0);
      table.integer("free_yoghurt").defaultTo(0);
      table.integer("free_granola").defaultTo(0);
      table.date("start_date")
      table.timestamps();
    });
  }

  down() {
    this.drop("packages");
  }
}

module.exports = PackagesSchema;
