'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SetupMenuBpd extends Model {
    static get table() {
        return "setup_menus_bpds"; // ต้องตรงกับชื่อของตารางในฐานข้อมูล
      }
    
      menu() {
        return this.belongsTo("App/Models/Menu");
      }
}

module.exports = SetupMenuBpd
