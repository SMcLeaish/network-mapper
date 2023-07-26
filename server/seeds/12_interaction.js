exports.seed = function(knex) {
    return knex('interaction').del()
      .then(function () {
        return knex('interaction').insert([
          {weight: 1, id_entity_1: 1, id_entity_2: 2, id_event: 1},
          {weight: 1, id_entity_1: 2, id_entity_2: 3, id_event: 2},
          {weight: 1, id_entity_1: 3, id_entity_2: 4, id_event: 3},
          {weight: 1, id_entity_1: 4, id_entity_2: 5, id_event: 4},
          {weight: 1, id_entity_1: 5, id_entity_2: 6, id_event: 5},
          {weight: 1, id_entity_1: 6, id_entity_2: 7, id_event: 1},
          {weight: 1, id_entity_1: 7, id_entity_2: 8, id_event: 2},
          {weight: 1, id_entity_1: 8, id_entity_2: 9, id_event: 3},
          {weight: 1, id_entity_1: 9, id_entity_2: 10, id_event: 4},
          {weight: 1, id_entity_1: 10, id_entity_2: 1, id_event: 5},
          {weight: 1, id_entity_1: 2, id_entity_2: 8, id_event: 1},
          {weight: 1, id_entity_1: 3, id_entity_2: 9, id_event: 2},
          {weight: 1, id_entity_1: 4, id_entity_2: 10, id_event: 3},
          {weight: 1, id_entity_1: 5, id_entity_2: 8, id_event: 4},
          {weight: 1, id_entity_1: 6, id_entity_2: 9, id_event: 5},
          {weight: 1, id_entity_1: 7, id_entity_2: 10, id_event: 1},
          {weight: 1, id_entity_1: 8, id_entity_2: 2, id_event: 2},
          {weight: 1, id_entity_1: 9, id_entity_2: 3, id_event: 3},
          {weight: 1, id_entity_1: 10, id_entity_2: 4, id_event: 4},
          {weight: 1, id_entity_1: 1, id_entity_2: 5, id_event: 5},
          {weight: 1, id_entity_1: 2, id_entity_2: 6, id_event: 1},
          {weight: 1, id_entity_1: 3, id_entity_2: 7, id_event: 2},
          {weight: 1, id_entity_1: 4, id_entity_2: 8, id_event: 3},
          {weight: 1, id_entity_1: 5, id_entity_2: 9, id_event: 4},
          {weight: 1, id_entity_1: 6, id_entity_2: 10, id_event: 5},
          {weight: 1, id_entity_1: 7, id_entity_2: 1, id_event: 1},
          {weight: 1, id_entity_1: 8, id_entity_2: 2, id_event: 2},
          {weight: 1, id_entity_1: 9, id_entity_2: 3, id_event: 3},
          {weight: 1, id_entity_1: 10, id_entity_2: 4, id_event: 4},
          {weight: 1, id_entity_1: 1, id_entity_2: 12, id_event: 5}
        ])
        .then(function(){
            return knex.raw("SELECT setval('interaction_id_seq', (SELECT MAX(id) from interaction))");
          });
        }); 
    }
