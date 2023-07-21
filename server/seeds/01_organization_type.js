exports.seed = function(knex) {
    return knex('organization_type').del()
      .then(function () {
        return knex('organization_type').insert([
          {organization_type: 'NGO'},
          {organization_type: 'Corporation'},
          {organization_type: 'Military'}
        ]);
      });
  };
  