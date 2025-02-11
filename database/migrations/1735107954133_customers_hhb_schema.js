'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CustomersHhbSchema extends Schema {
  up () {
    this.create('customers_hhbs', (table) => {
      table.increments('id') 
      table.varchar('customer_id', 15).unique().notNullable() 
      table.varchar('name').notNullable() 
      table.varchar('package')
      table.varchar('email', 100)
      table.varchar('tel') 
      table.varchar('line_id')
      table.text('address') 
      table.text('nearby_places') 
      table.text('recipient')
      table.text('other_detail') 
      table.text('note') 
      table.varchar('seller_name')
      table.text('address_1')
      table.varchar('zone_1') 
      table.text('address_2') 
      table.varchar('zone_2')
      table.text('address_3') 
      table.varchar('zone_3')
      table.timestamps(true, true) 
    })
  }

  down () {
    this.drop('customers_hhbs')
  }
}

module.exports = CustomersHhbSchema
