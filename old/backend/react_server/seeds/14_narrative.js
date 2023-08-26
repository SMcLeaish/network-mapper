exports.seed = function(knex) {
    return knex('narrative').del()
      .then(function () {
        return knex('narrative').insert([
          {user_data_id: 1, date: '2023-07-21', narrative_string: 'Lorem ipsum dolor sit amet, consectetur adipiscing.', id_entity: 1, id_event: 1},
          {user_data_id: 1, date: '2023-07-21', narrative_string: 'Aliquam ultrices eros in cursus cursus.', id_entity: 2, id_event: 1},
  
          {user_data_id: 2, date: '2023-07-22', narrative_string: 'Vivamus quis augue eu ex pellentesque volutpat.', id_entity: 2, id_event: 2},
          {user_data_id: 2, date: '2023-07-22', narrative_string: 'Vestibulum volutpat libero nec neque pellentesque, ac.', id_entity: 3, id_event: 2},
  
          {user_data_id: 3, date: '2023-07-23', narrative_string: 'Etiam aliquam tortor nec tempus commodo.', id_entity: 3, id_event: 3},
          {user_data_id: 3, date: '2023-07-23', narrative_string: 'Nunc fringilla diam ac felis mollis interdum.', id_entity: 4, id_event: 3},
  
          {user_data_id: 4, date: '2023-07-24', narrative_string: 'Praesent at augue quis ligula fermentum blandit.', id_entity: 4, id_event: 4},
          {user_data_id: 4, date: '2023-07-24', narrative_string: 'Nullam ut ipsum in sapien euismod viverra.', id_entity: 5, id_event: 4},
  
          {user_data_id: 5, date: '2023-07-25', narrative_string: 'Pellentesque pharetra nibh ac lorem consectetur tincidunt.', id_entity: 5, id_event: 5},
          {user_data_id: 5, date: '2023-07-25', narrative_string: 'Sed sed ipsum sit amet augue euismod convallis.', id_entity: 6, id_event: 5}
        ]);
      })
      .then(function(){
        return knex.raw("SELECT setval('narrative_id_seq', (SELECT MAX(id) from narrative))");
      });
  };
  