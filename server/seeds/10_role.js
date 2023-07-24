exports.seed = function(knex) {
    return knex('role').del()
      .then(function () {
        return knex('role').insert([
          { title: 'Squad Leader', responsibilites_id: 6 },
          { title: 'Commander', responsibilites_id: 7 },
          { title: 'Lead Accountant', responsibilites_id: 3 },
          { title: 'Project Manager', responsibilites_id: 6 },
          { title: 'Training Coordinator', responsibilites_id: 5 },
          { title: 'Governmental Coordinator', responsibilites_id: 4 },
          { title: 'Quality Assurance Specialist', responsibilites_id: 8 },
          { title: 'Customer Relations Manager', responsibilites_id: 9 },
          { title: 'Contractor', responsibilites_id: 2 },
          { title: 'Strategic Planner', responsibilites_id: 10 }
        ]);
      })
      .then(function(){
        return knex.raw("SELECT setval('role_id_seq', (SELECT MAX(id) from role))");
    });
}
