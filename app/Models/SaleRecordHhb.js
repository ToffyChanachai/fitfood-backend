'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SaleRecordHhb extends Model {
    static get table() {
        return "sale_records_hhbs"; 
      }
    
      customer() {
        return this.belongsTo("App/Models/CustomerHhB");
      }
    
      promotionType() {
        return this.belongsTo("App/Models/PromotionType");
      }
    
      program() {
        return this.belongsTo("App/Models/Program");
      }
    
      package() {
        return this.belongsTo("App/Models/Package");
      }
    
      packageType() {
        return this.belongsTo("App/Models/PackageType");
      }
    
      paymentType() {
        return this.belongsTo("App/Models/PaymentType");
      }
    
      zone1() {
        return this.belongsTo("App/Models/ZoneDelivery", "zone1_id", "id");
      }
    
      zone2() {
        return this.belongsTo("App/Models/ZoneDelivery", "zone2_id", "id");
      }
    
      zone3() {
        return this.belongsTo("App/Models/ZoneDelivery", "zone3_id", "id");
      }
    
      zoneOutsource() {
        return this.belongsTo("App/Models/ZoneDelivery", "zone_outsource_id", "id");
      }
    
      additionalType() {
        return this.belongsTo("App/Models/ZoneDelivery");
      }
    
      deliveryRound() {
        return this.belongsTo("App/Models/DeliveryRound");
      }
    
      receiveFood() {
        return this.belongsTo("App/Models/ReceiveFood");
      }
    
      selecetFood() {
        return this.belongsTo("App/Models/SelectFood");
      }
}

module.exports = SaleRecordHhb
