"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MealTypeSchema extends Schema {
  up() {
    this.create("meal_types", (table) => {
      table.increments();
      table.varchar("name").notNullable();
      table
        .integer("menu_type_id")
        .unsigned()
        .references("id")
        .inTable("menu_types")
        .onDelete("CASCADE");
      table.timestamps();
    });
  }

  down() {
    this.drop("meal_types");
  }
}

module.exports = MealTypeSchema;
