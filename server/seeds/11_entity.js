exports.seed = function(knex) {
    return knex('entity').del()
      .then(function () {
        return knex('entity').insert([
          {id_organization: 1},
          {id_organization: 2},
          {id_organization: 3},
          {id_organization: 4},
          {id_organization: 5},
          {id_organization: 6},
          {id_organization: 7},
          {id_individual: 1},
          {id_individual: 2},
          {id_individual: 3},
          {id_individual: 4},
          {id_individual: 5},
          {id_individual: 6},
          {id_individual: 7},
          {id_individual: 8},
          {id_individual: 9},
          {id_individual: 10}
        ]);
      })
      .then(function(){
        return knex.raw("SELECT setval('entity_id_seq', (SELECT MAX(id) from entity))");
    });
}
