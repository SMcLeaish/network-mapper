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
        {weight: 1, id_entity_1: 11, id_entity_2: 2, id_event: 1},
        {weight: 1, id_entity_1: 11, id_entity_2: 3, id_event: 2},
        {weight: 1, id_entity_1: 11, id_entity_2: 4, id_event: 3},
        {weight: 1, id_entity_1: 11, id_entity_2: 5, id_event: 4},
        {weight: 1, id_entity_1: 12, id_entity_2: 5, id_event: 4},
        {weight: 1, id_entity_1: 13, id_entity_2: 5, id_event: 4},
        {weight: 1, id_entity_1: 14, id_entity_2: 5, id_event: 4},
        {weight: 1, id_entity_1: 15, id_entity_2: 5, id_event: 4},
        {weight: 1, id_entity_1: 16, id_entity_2: 5, id_event: 4},
        {weight: 1, id_entity_1: 17, id_entity_2: 5, id_event: 4},

        // Interactions with 2021-12-19-meeting-QuantumDynamics_Headquarters event number 11
        {weight: 1, id_entity_1: 8, id_entity_2: 20, id_event: 11},
        {weight: 1, id_entity_1: 8, id_entity_2: 25, id_event: 11},
        {weight: 1, id_entity_1: 8, id_entity_2: 28, id_event: 11},
        {weight: 1, id_entity_1: 8, id_entity_2: 17, id_event: 11},
        {weight: 1, id_entity_1: 8, id_entity_2: 22, id_event: 11},


        {weight: 1, id_entity_1: 20, id_entity_2: 25, id_event: 11},
        {weight: 1, id_entity_1: 20, id_entity_2: 28, id_event: 11},
        {weight: 1, id_entity_1: 20, id_entity_2: 8, id_event: 11},

        {weight: 1, id_entity_1: 22, id_entity_2: 25, id_event: 11},
        {weight: 1, id_entity_1: 22, id_entity_2: 8, id_event: 11},
        {weight: 1, id_entity_1: 22, id_entity_2: 17, id_event: 11},

        // this is the link to lower taiwan connections with Jase Pollard
        {weight: 1, id_entity_1: 21, id_entity_2: 8, id_event: 11},

        // this is the interactions from event 2022-09-22-meeting-StarTech_Headquarters
        {weight: 1, id_entity_1: 21, id_entity_2: 13, id_event: 9},
        {weight: 1, id_entity_1: 21, id_entity_2: 14, id_event: 9},
        {weight: 1, id_entity_1: 21, id_entity_2: 26, id_event: 9},
        {weight: 1, id_entity_1: 21, id_entity_2: 16, id_event: 9},
        {weight: 1, id_entity_1: 21, id_entity_2: 10, id_event: 9},

        {weight: 1, id_entity_1: 13, id_entity_2: 21, id_event: 9},
        {weight: 1, id_entity_1: 13, id_entity_2: 14, id_event: 9},
        {weight: 1, id_entity_1: 13, id_entity_2: 26, id_event: 9},
        {weight: 1, id_entity_1: 13, id_entity_2: 16, id_event: 9},

        {weight: 1, id_entity_1: 14, id_entity_2: 13, id_event: 9},
        {weight: 1, id_entity_1: 14, id_entity_2: 21, id_event: 9},
        {weight: 1, id_entity_1: 14, id_entity_2: 26, id_event: 9},
        {weight: 1, id_entity_1: 14, id_entity_2: 16, id_event: 9},
        
        {weight: 1, id_entity_1: 16, id_entity_2: 13, id_event: 9},
        {weight: 1, id_entity_1: 16, id_entity_2: 14, id_event: 9},
        {weight: 1, id_entity_1: 16, id_entity_2: 26, id_event: 9},
        {weight: 1, id_entity_1: 16, id_entity_2: 21, id_event: 9},
        {weight: 1, id_entity_1: 18, id_entity_2: 21, id_event: 9},
        {weight: 1, id_entity_1: 19, id_entity_2: 20, id_event: 9},
        {weight: 1, id_entity_1: 21, id_entity_2: 22, id_event: 9},
        {weight: 1, id_entity_1: 23, id_entity_2: 24, id_event: 9},
        {weight: 1, id_entity_1: 25, id_entity_2: 26, id_event: 9},
        {weight: 1, id_entity_1: 27, id_entity_2: 28, id_event: 9},
        {weight: 1, id_entity_1: 29, id_entity_2: 30, id_event: 9},
        {weight: 1, id_entity_1: 31, id_entity_2: 4, id_event: 9},

      ])
      .then(function(){
          return knex.raw("SELECT setval('interaction_id_seq', (SELECT MAX(id) from interaction))");
        });
      }); 
  }