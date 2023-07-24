exports.seed = function(knex) {
    return knex('event_type').del()
      .then(function () {
        return knex('event_type').insert([
          {type: 'meeting'},
          {type: 'conference'},
          {type: 'military'}
        ]);
      });
  };