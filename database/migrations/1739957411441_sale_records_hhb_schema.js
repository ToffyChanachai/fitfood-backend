'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SaleRecordsHhbSchema extends Schema {
  up () {
    this.create('sale_records_hhbs', (table) => {
      table.increments()
      table.integer('customer_id').unsigned().references('id').inTable('customers_hhbs').onDelete('CASCADE')
      table.integer('promotion_type_id').unsigned().references('id').inTable('promotion_types').onDelete('CASCADE') 
      table.integer('program_id').unsigned().references('id').inTable('programs').onDelete('CASCADE') 
      table.integer('package_id').unsigned().references('id').inTable('packages').onDelete('CASCADE') 
      table.integer('package_type_id').unsigned().references('id').inTable('package_types').onDelete('CASCADE') 
      table.integer('seller_name_id').unsigned().references('id').inTable('seller_names').onDelete('CASCADE')
      table.decimal('package_price').defaultTo(0);

      table.integer('additional_type_id').unsigned().references('id').inTable('additional_types').onDelete('CASCADE')
      table.text('add_detail');
      table.decimal('add_price').defaultTo(0);

      table.decimal('discount').defaultTo(0);

      table.decimal('extra_charge').defaultTo(0);
      table.decimal('extra_charge_price').defaultTo(0);
      table.decimal('total_package_price').defaultTo(0);

      table.integer('receive_food_id').unsigned().references('id').inTable('receive_foods').onDelete('CASCADE')
      table.integer('zone1_id').unsigned().references('id').inTable('zone_deliveries').onDelete('CASCADE')
      table.integer('zone1_quantity').defaultTo(0);
      table.decimal('total_zone1_price').defaultTo(0);

      table.integer('zone2_id').unsigned().references('id').inTable('zone_deliveries').onDelete('CASCADE')
      table.integer('zone2_quantity').defaultTo(0);
      table.decimal('total_zone2_price').defaultTo(0);

      table.integer('zone3_id').unsigned().references('id').inTable('zone_deliveries').onDelete('CASCADE')
      table.integer('zone3_quantity').defaultTo(0);
      table.decimal('total_zone3_price').defaultTo(0);

      table.integer('zone_outsource_id').unsigned().references('id').inTable('zone_deliveries').onDelete('CASCADE')
      table.integer('zone_outsource_quantity').defaultTo(0);
      table.decimal('total_zone_outsource_price').defaultTo(0);

      table.decimal('total_delivery_zone_price').defaultTo(0);
      table.decimal('total_delivery_price').defaultTo(0);

      table.decimal('total_price').defaultTo(0);
      table.enum('payment_status', ['paid', 'unpaid']).defaultTo('unpaid')
      table.date('paid_date')
      table.integer('payment_type_id').unsigned().references('id').inTable('payment_types').onDelete('CASCADE')
      table.date('start_date')
      table.date('expiry_date')
      table.integer('remaining_days')

       
      table.integer('delivery_round_id').unsigned().references('id').inTable('delivery_rounds').onDelete('CASCADE') 
      table.integer('select_food_id').unsigned().references('id').inTable('select_foods').onDelete('CASCADE') 
      table.text('note')


      table.integer('mad').defaultTo(0);
      table.integer('dessert').defaultTo(0);
      table.integer('brittles').defaultTo(0);
      table.integer('energy_balls').defaultTo(0);
      table.integer('dressing').defaultTo(0);
      table.integer('yoghurt').defaultTo(0);
      table.integer('granola').defaultTo(0);

      table.integer('free_mad').defaultTo(0);
      table.integer('free_dessert').defaultTo(0);
      table.integer('free_brittles').defaultTo(0);
      table.integer('free_energy_balls').defaultTo(0);
      table.integer('free_dressing').defaultTo(0);
      table.integer('free_yoghurt').defaultTo(0);
      table.integer('free_granola').defaultTo(0);
      table.integer('total_boxes').defaultTo(0);
      
      table.timestamps()
    })
  }

  down () {
    this.drop('sale_records_hhbs')
  }
}

module.exports = SaleRecordsHhbSchema
