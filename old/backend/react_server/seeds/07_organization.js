const organizations = require('../data/organizations.json');
exports.seed = function(knex) {
  return knex('organization').del()
    .then(function () {
      return knex('organization').insert(organizations);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('organization_id_seq', (SELECT MAX(id) FROM organization));"
      );
    }
    )}
