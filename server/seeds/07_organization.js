exports.seed = function(knex) {
  return knex('organization').del()
    .then(function () {
      return knex('organization').insert([
        { id: 1, name: 'Interstellar Corp', location: [17.55426, 102.18803], organization_type_id: 2, id_user_data: Math.floor(Math.random() * 5) + 1 }, 
        { id: 2, name: 'StarTech Industries', location: [18.55431, 102.18808], organization_type_id: 2, id_user_data: Math.floor(Math.random() * 5) + 1 },
        { id: 3, name: 'Quantum Dynamics', location: [15.55436, 102.18813], organization_type_id: 2, id_user_data: Math.floor(Math.random() * 5) + 1 },
        { id: 4, name: 'Global Health Initiative', location: [20.55441, 102.18818], organization_type_id: 1, id_user_data: Math.floor(Math.random() * 5) + 1  },
        { id: 5, name: 'Education for All Foundation', location: [15.55446, 103.18823], organization_type_id: 1, id_user_data: Math.floor(Math.random() * 5) + 1  },
        { id: 6, name: 'Royal Thai Armed Forces - Unit 1', location: [15.55451, 104.18828], organization_type_id: 3, id_user_data: Math.floor(Math.random() * 5) + 1  },
        { id: 7, name: 'Royal Thai Armed Forces - Unit 2', location: [18.55456, 105.18833], organization_type_id: 3, id_user_data: Math.floor(Math.random() * 5) + 1 },
      ]);
    })
    .then(function(){
      return knex.raw("SELECT setval('organization_id_seq', (SELECT MAX(id) from organization))");
  });
}
