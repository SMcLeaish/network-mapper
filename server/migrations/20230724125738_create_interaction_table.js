/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('interaction').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('interaction', table => {
            table.increments('id');
            table.integer('weight');
            table.integer('id_entity_1');
            table.foreign('id_entity_1').references('entity.id').deferrable('deferred');
            table.integer('id_entity_2');
            table.foreign('id_entity_2').references('entity.id').deferrable('deferred');
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
  return knex.schema.dropTableIfExists('interaction')
};
