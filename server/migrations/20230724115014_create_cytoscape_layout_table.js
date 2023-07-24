/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('cytoscape_layout_type').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('cytoscape_layout_type', table => {
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
  return knex.schema.dropTableIfExists('cytoscape_layout_type')
};
