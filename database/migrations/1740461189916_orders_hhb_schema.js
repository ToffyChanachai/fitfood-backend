'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrdersHhbSchema extends Schema {
  up () {
    this.create('orders_hhbs', (table) => {
      table.increments()
      table.integer('menu_id').unsigned().references('id').inTable('menus') 
      table.integer('quantity').defaultTo(0);
      table.integer('menu_type_id').unsigned().references('id').inTable('menu_types').onDelete('CASCADE')
      table.date('order_date')
      table.enu('status', ['pending', 'confirm']).defaultTo('pending')  
      table.integer("sale_record_id").unsigned().references("id").inTable("sale_records_hhbs").nullable();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('customer_id').unsigned().references('id').inTable('customers_hhbs').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('orders_hhbs')
  }
}

module.exports = OrdersHhbSchema
