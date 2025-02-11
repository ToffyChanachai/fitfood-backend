'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Setting extends Model {
    static get table() {
        return 'start_date_to_setup_menus'; // ชื่อ table ที่เก็บค่าของ start_date
      }
}

module.exports = Setting
