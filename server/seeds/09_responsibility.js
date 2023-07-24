exports.seed = function(knex) {
    return knex('responsibilities').del()
      .then(function () {
        return knex('responsibilities').insert([
          { name: 'Book Keeping' },
          { name: 'Contracting' },
          { name: 'Accounts Receivable' },
          { name: 'Governmental Coordination' },
          { name: 'Training Coordination' },
          { name: 'Project Management' },
          { name: 'Team Leadership' },
          { name: 'Quality Assurance' },
          { name: 'Customer Relations' },
          { name: 'Strategic Planning' }
        ]);
      })
      .then(function(){
        return knex.raw("SELECT setval('responsibilities_id_seq', (SELECT MAX(id) from responsibilities))");
    });
}
