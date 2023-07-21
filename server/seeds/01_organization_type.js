exports.seed = function(knex) {
    return knex('organization_type').del()
      .then(function () {
        return knex('organization_type').insert([
          {type: 'ngo'},
          {type: 'corporation'},
          {type: 'military'}
        ]);
      });
  };
  