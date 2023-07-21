exports.seed = function(knex) {
    return knex('event_type').del()
      .then(function () {
        return knex('event_type').insert([
          {organization_type: 'meeting'},
          {organization_type: 'conference'},
          {organization_type: 'military'}
        ]);
      });
  };