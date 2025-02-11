"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ZoneDelivery extends Model {
  saleRecordsAff() {
    return this.hasMany('App/Models/SaleRecordsAff')
  }

  zoneType() {
    return this.belongsTo("App/Models/ZoneDeliveryType", "zone_type_id", "id");
  }
}

module.exports = ZoneDelivery;
