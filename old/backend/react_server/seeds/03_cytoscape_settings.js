exports.seed = function(knex) {
    return knex('cytoscape_setting').del()
      .then(function () {
        return knex('cytoscape_setting').insert([
          {id: 1, id_user_data: 1, id_cytoscape_layout_type: 1, name: 'grid', fit: true},
          {id: 2, id_user_data: 2, id_cytoscape_layout_type: 2, name: 'circle', fit: true, animate: true, animationDuration: 500},
          {id: 3, id_user_data: 3, id_cytoscape_layout_type: 3, name: 'breadthfirst', fit: true},
          {id: 4, id_user_data: 1, id_cytoscape_layout_type: 4, name: 'cose', fit: true, padding: 30, 
          randomize: false, componentSpacing: 100, nodeRepulsion: 40000000, edgeElasticity: 100, 
          nestingFactor: 5, gravity: 80, numIter: 1000, initialTemp: 200, coolingFactor: 0.95, 
          minTemp: 1.0, animate: true, animationDuration: 500},
          {id: 5, id_user_data: 2, id_cytoscape_layout_type: 5, name: 'concentric', fit: true},
          {id: 6, id_user_data: 3, id_cytoscape_layout_type: 6, name: 'random', fit: true},
          {id: 7, id_user_data: 1, id_cytoscape_layout_type: 7, name: 'fcose', fit: true},
          {id: 8, id_user_data: 2, id_cytoscape_layout_type: 8, name: 'cola', fit: true}
        ]);
      })
      .then(function(){
        return knex.raw("SELECT setval('cytoscape_setting_id_seq', (SELECT MAX(id) from cytoscape_setting))");
    });
}