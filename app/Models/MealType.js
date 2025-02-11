"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class MealType extends Model {
  menus() {
    return this.hasMany("App/Models/Menu");
  }

  menuType() {
    return this.belongsTo("App/Models/MenuType");
  }
}

module.exports = MealType;
