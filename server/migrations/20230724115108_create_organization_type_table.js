/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('organization_type').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('organization_type', table => {
            table.increments('id');
            table.string('type', 250);
        })
    }
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('organization_type')
};
