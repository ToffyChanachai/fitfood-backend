'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CustomersSchema extends Schema {
  up () {
    this.create('customers', (table) => {
      table.increments('id') 
      table.varchar('email', 100)
      table.varchar('customer_id', 15).unique().notNullable() 
      table.varchar('name').notNullable() 
      table.enum('gender', ['female', 'male'])
      table.varchar('tel') 
      table.varchar('line_id')
      table.text('food_allergies')
      table.varchar('delivery_date')
      table.text('address_mon_to_fri') 
      table.text('recipient_mon_to_fri')
      table.text('address_sat_to_sun') 
      table.text('recipient_sat_to_sun')
      table.text('other_detail') 
      table.text('note') 
      table.text('address_1')
      table.text('address_2') 
      table.text('address_3') 
      table.timestamps(true, true) 
    })
  }

  down () {
    this.drop('customers')
  }
}

module.exports = CustomersSchema
