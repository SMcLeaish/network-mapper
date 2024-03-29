/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('user_data').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('user_data', function(table) {
                table.increments('id').primary();
                table.string('username');
                table.string('hashed_password');
                table.string("email");
                table.string('user_organization');
                table.string('distinguished_name');
                table.boolean('cac_approved').defaultTo(false);
                table.string("emailToken").nullable()
                table.boolean("isVerified")
                table.string("session_cookie").nullable()
            });
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_data');
};

