const karate = require('../data/karate.js');

exports.seed = function (knex) {
  return knex('interaction').del()
    .then(function () {
      const mappedKarate = karate.map(pair => {
        return {
            weight: 1,
            id_entity_1: pair.source,
            id_entity_2: pair.target,
            id_event: Math.floor(Math.random() * 16) + 1
        };
      });

      return knex('interaction').insert(mappedKarate);
    })
    .then(function () {
        return knex.raw("SELECT setval('interaction_id_seq', (SELECT MAX(id) from interaction))");
    });
}
