/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('interaction').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('interaction', table => {
            table.increments('id');
            table.integer('individual_id')
            table.foreign('individual_id').references('individual.id').deferrable('deferred')
            table.integer('organization_id')
            table.foreign('organization_id').references('organization.id').deferrable('deferred')
            table.integer('event_id')
            table.foreign('event_id').references('event.id').deferrable('deferred')
            table.integer('individual2_id')
            table.foreign('individual2_id').references('individual.id').deferrable('deferred')
            table.integer('organization2_id')
            table.foreign('organization2_id').references('organization.id').deferrable('deferred')
            table.integer('weight')
        })
    }
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('interaction')
};
