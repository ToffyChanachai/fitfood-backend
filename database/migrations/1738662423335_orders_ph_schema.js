'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrdersPhSchema extends Schema {
  up () {
    this.create('orders_phs', (table) => {
      table.increments()
      table.integer('menu_id').unsigned().references('id').inTable('menus') 
      table.integer('quantity').defaultTo(0);
      table.timestamps()
    })
  }

  down () {
    this.drop('orders_phs')
  }
}

module.exports = OrdersPhSchema
