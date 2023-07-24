/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('position').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('position', table => {
            table.increments('id');
            table.integer('individual_id')
            table.foreign('individual_id').references('individual.id').deferrable('deferred')
            table.integer('organization_id')
            table.foreign('organization_id').references('organization.id').deferrable('deferred')
            table.integer('role_id')
            table.foreign('role_id').references('role.id').deferrable('deferred')
        })
    }
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('position')
};
