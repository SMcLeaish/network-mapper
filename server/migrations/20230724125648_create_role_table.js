/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('role').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('role', table => {
            table.increments('id');
            table.string('title', 250);
            table.integer('responsibilities_id')
            table.foreign('responsibilities_id').references('responsibilities.id').deferrable('deferred')
        })
    }
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('role')
};
