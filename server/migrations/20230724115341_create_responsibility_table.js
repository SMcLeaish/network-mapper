/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('responsibilities').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('responsibilities', table => {
            table.increments('id');
            table.string('name', 250);
        })
    }
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('responsibilities')
};
