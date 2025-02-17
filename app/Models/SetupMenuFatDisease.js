'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SetupMenuFatDisease extends Model {
    static get table() {
        return "setup_menus_fat_diseases"; // ต้องตรงกับชื่อของตารางในฐานข้อมูล
      }
    
      menu() {
        return this.belongsTo("App/Models/Menu");
      }
}

module.exports = SetupMenuFatDisease
