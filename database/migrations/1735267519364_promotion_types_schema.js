'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PromotionTypesSchema extends Schema {
  up () {
    this.create('promotion_types', (table) => {
      table.increments()
      table.varchar('name').unique().notNullable() 
      table.timestamps()
    })
  }

  down () {
    this.drop('promotion_types')
  }
}

module.exports = PromotionTypesSchema
