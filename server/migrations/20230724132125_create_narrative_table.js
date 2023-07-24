/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('narrative').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('narrative', table => {
            table.increments('id');
            table.integer('user_data_id')
            table.foreign('user_data_id').references('user_data.id').deferrable('deferred')
            table.string('date', 250)
            table.string('narrative_string', 2000)
            table.integer('id_organization');
            table.foreign('id_organization').references('organization.id').deferrable('deferred')
            table.integer('id_individual');
            table.foreign('id_individual').references('individual.id').deferrable('deferred');
            table.integer('id_event');
            table.foreign('id_event').references('event.id').deferrable('deferred');
        })
    }
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('narrative')
};
