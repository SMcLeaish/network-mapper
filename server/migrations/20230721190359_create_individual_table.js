/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('individual').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('individual', table => {
            table.increments('id');
            table.string('name', 250);
            table.string('phone_number', 250);
            table.specificType('location', 'number[]')
        })
    }
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('individual')
};
