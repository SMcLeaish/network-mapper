exports.seed = function(knex) {
    return knex('event_type').del()
      .then(function () {
        return knex('event_type').insert([
          {type: 'meeting'},
          {type: 'conference'},
          {type: 'joint training'}
        ]);
      }).then(function(){
        return knex.raw("SELECT setval('event_type_id_seq', (SELECT MAX(id) from event_type))");
    });
}