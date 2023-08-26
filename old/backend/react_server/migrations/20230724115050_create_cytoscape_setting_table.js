/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('cytoscape_setting').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('cytoscape_setting', function(table) {
                table.increments('id').primary();
                table.integer('id_user_data');
                table.foreign('id_user_data').references('user_data.id').deferrable('deferred');
                table.integer('id_cytoscape_layout_type');
                table.foreign('id_cytoscape_layout_type').references('cytoscape_layout_type.id').deferrable('deferred');
                table.string('name');
                table.boolean('fit').defaultTo(null);
                table.boolean('animate').defaultTo(null);
                table.integer('animationDuration').defaultTo(null);
                table.float('idealEdgeLength').defaultTo(null);
                table.integer('nodeOverlap').defaultTo(null);
                table.integer('refresh').defaultTo(null);
                table.integer('componentSpacing').defaultTo(null);
                table.float('nodeRepulsion').defaultTo(null);
                table.float('edgeElasticity').defaultTo(null);
                table.integer('nestingFactor').defaultTo(null);
                table.integer('gravity').defaultTo(null);
                table.integer('numIter').defaultTo(null);
                table.integer('initialTemp').defaultTo(null);
                table.float('coolingFactor').defaultTo(null);
                table.float('minTemp').defaultTo(null);
                table.boolean('randomize').defaultTo(null);
                table.float('padding').defaultTo(null);
            });
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('cytoscape_setting');
};

