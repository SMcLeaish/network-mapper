const individuals = require('../data/individuals.json');
exports.seed = function(knex) {
  return knex('individual').del()
    .then(function () {
      return knex('individual').insert(individuals);
    })
    .then(function(){
      return knex.raw("SELECT setval('individual_id_seq', (SELECT MAX(id) from individual))");
    });
};
