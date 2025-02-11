"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class PackageType extends Model {
  packages() {
    return this.hasMany("App/Models/SaleRecordsAff");
  }
}

module.exports = PackageType;
