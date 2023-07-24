exports.seed = function(knex) {
    return knex('organization_type').del()
      .then(function () {
        return knex('organization_type').insert([
          {type: 'N/A'},
          {type: 'ngo'},
          {type: 'corporation'},
          {type: 'military'}
        ]);
      }).then(function(){
        return knex.raw("SELECT setval('organization_type_id_seq', (SELECT MAX(id) from organization_type))");
    });
}
  