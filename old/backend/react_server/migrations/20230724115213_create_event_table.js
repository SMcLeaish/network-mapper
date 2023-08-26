/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('event').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('event', table => {
            table.increments('id');
            table.string('event_name', 250)
            table.string('date', 250);
            table.specificType('location', 'float[]');
            table.string('mgrs', 20);
            table.integer('event_type_id');
            table.foreign('event_type_id').references('event_type.id').deferrable('deferred')
            table.integer('id_user_data');
            table.foreign('id_user_data').references('user_data.id').deferrable('deferred');
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
