exports.up = function(knex) {
    return knex.schema.hasTable('cytoscape_setting').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('cytoscape_setting', function(table) {
                table.integer('id').primary();
                table.integer('id_user_data');
                table.foreign('id_user_data').references('user_data.id').deferrable('deffered');
                table.integer('id_cytoscape_layout_type');
                table.foreign('id_cytoscape_layout_type').references('cytoscape_layout_type.id').deferrable('deffered');
            });
        }
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('cytoscape_setting');
};
