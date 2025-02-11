"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Package extends Model {
  program () {
    return this.belongsTo('App/Models/Program')
  }
}

module.exports = Package;
