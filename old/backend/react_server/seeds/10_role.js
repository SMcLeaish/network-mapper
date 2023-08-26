exports.seed = function(knex) {
    return knex('role').del()
      .then(function () {
        return knex('role').insert([
          { title: 'Squad Leader', responsibilities_id: 6 },
          { title: 'Commander', responsibilities_id: 7 },
          { title: 'Lead Accountant', responsibilities_id: 3 },
          { title: 'Project Manager', responsibilities_id: 6 },
          { title: 'Training Coordinator', responsibilities_id: 5 },
          { title: 'Governmental Coordinator', responsibilities_id: 4 },
          { title: 'Quality Assurance Specialist', responsibilities_id: 8 },
          { title: 'Customer Relations Manager', responsibilities_id: 9 },
          { title: 'Contractor', responsibilities_id: 2 },
          { title: 'Strategic Planner', responsibilities_id: 10 }
        ]);
      })
      .then(function(){
        return knex.raw("SELECT setval('role_id_seq', (SELECT MAX(id) from role))");
    });
}
