/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('event').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('event', table => {
            table.increments('id');
            table.integer('id_individual');
            table.foreign('id_individual').references('individual.id').deferrable('deferred')
            table.integer('id_');
            table.foreign('id_user_data').references('user_data.id').deferrable('deffered');
        })
    }
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('event')
};