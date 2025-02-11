"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MenuSchema extends Schema {
  up() {
    this.create("menus", (table) => {
      table.increments();
      table.varchar("menu_code").notNullable()
      table.varchar("name_english").notNullable()
      table.varchar("name_thai").notNullable()
      table
        .integer("meal_type_id")
        .unsigned()
        .references("id")
        .inTable("meal_types")
        .onDelete("CASCADE");
      table.integer("cal").defaultTo(0);
      table.integer("protein").defaultTo(0);
      table.integer("fat").defaultTo(0);
      table.integer("carb").defaultTo(0);
      table.timestamps();
    });
  }

  down() {
    this.drop("menus");
  }
}

module.exports = MenuSchema;
