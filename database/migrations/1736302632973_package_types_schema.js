'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PackageTypesSchema extends Schema {
  up () {
    this.create('package_types', (table) => {
      table.increments()
      table.varchar('name').unique().notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('package_types')
  }
}

module.exports = PackageTypesSchema
