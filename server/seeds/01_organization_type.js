exports.seed = function(knex) {
    return knex('organization_type').del()
      .then(function () {
        return knex('organization_type').insert([
          {organization_type: 'ngo'},
          {organization_type: 'corporation'},
          {organization_type: 'military'}
        ]);
      });
  };
  