/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('organization').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('organization', table => {
            table.increments('id');
            table.string('name', 250);
            table.string('phone_number', 250);
            table.specificType('location', 'integer[]');
            table.integer('organization_type_id');
            table.foreign('organization_type_id').references('organization_type.id').deferrable('deferred')
        })
    }
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('organization')
};

