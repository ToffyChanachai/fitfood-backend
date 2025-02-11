"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Program extends Model {
  promotionType () {
    return this.belongsTo('App/Models/PromotionType')
  }

  packages () {
    return this.hasMany('App/Models/Package')
  }
}

module.exports = Program;
