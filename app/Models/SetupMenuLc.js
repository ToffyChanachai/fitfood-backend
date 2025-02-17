'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SetupMenuLc extends Model {
    static get table() {
        return "setup_menus_lcs"; // ต้องตรงกับชื่อของตารางในฐานข้อมูล
      }
    
      menu() {
        return this.belongsTo("App/Models/Menu");
      }
}

module.exports = SetupMenuLc
