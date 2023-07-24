exports.seed = function(knex) {
    return knex('cytoscape_layout_type').del()
      .then(function () {
        return knex('cytoscape_layout_type').insert([
          {type: 'grid'},
          {type: 'circle'},
          {type: 'breadthfirst'}
          {type: 'cose'},
          {type: 'concentric'},
          {type: 'random'},
          {type: 'fcose'}
        ]);
      });
  };