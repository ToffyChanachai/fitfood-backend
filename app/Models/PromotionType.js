"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class PromotionType extends Model {
  programs () {
    return this.hasMany('App/Models/Program')
  }
}

module.exports = PromotionType;
