"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class MenuType extends Model {
  mealTypes() {
    return this.hasMany("App/Models/MealType");
  }
}

module.exports = MenuType;
