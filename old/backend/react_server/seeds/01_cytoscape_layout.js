exports.seed = function(knex) {
  return knex('cytoscape_layout_type').del()
    .then(function () {
      return knex('cytoscape_layout_type').insert([
        {type: 'grid'},
        {type: 'circle'},
        {type: 'breadthfirst'},
        {type: 'cose'},
        {type: 'concentric'},
        {type: 'random'},
        {type: 'fcose'},
        {type: 'cola'}
      ]);
    })
    .then(function(){
        return knex.raw("SELECT setval('cytoscape_layout_type_id_seq', (SELECT MAX(id) from cytoscape_layout_type))");
    });
}
