/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('entity').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('entity', table => {
            table.increments('id');
            table.integer('id_organization');
            table.foreign('id_organization').references('organization.id').deferrable('deferred')
            table.integer('id_individual');
            table.foreign('id_individual').references('individual.id').deferrable('deferred');
        })
    }
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('entity')
};