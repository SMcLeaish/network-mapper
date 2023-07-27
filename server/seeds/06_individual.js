exports.seed = function(knex) {
  return knex('individual').del()
    .then(function () {
      return knex('individual').insert([
<<<<<<< HEAD
        { name: 'John Doe', location: [15.55376, 102.18753], phone_number: '1234567890', id_user_data: 1}, 
        { name: 'Jane Doe', location: [15.55381, 102.18758], phone_number: '2345678901', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Robert Smith', location: [15.55386, 102.18763], phone_number: '3456789012', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Sophia Johnson', location: [15.55391, 102.18768], phone_number: '4567890123', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'William Brown', location: [15.55396, 102.18773], phone_number: '5678901234', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Olivia Garcia', location: [15.55401, 102.18778], phone_number: '6789012345', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'James Davis', location: [15.55406, 102.18783], phone_number: '7890123456', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Emily Miller', location: [15.55411, 102.18788], phone_number: '8901234567', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Benjamin Wilson', location: [15.55416, 102.18793], phone_number: '9012345678', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Emma Moore', location: [15.55421, 102.18798], phone_number: '0123456789', id_user_data: Math.floor(Math.random() * 5) + 1 },
=======
        { name: 'John Doe', location: [15.54376, 102.98753], phone_number: '1234567890', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Jane Doe', location: [13.53381, 104.88758], phone_number: '2345678901', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Robert Smith', location: [15.52386, 108.18763], phone_number: '3456789012', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Sophia Johnson', location: [15.51391, 101.18768], phone_number: '4567890123', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'William Brown', location: [15.59396, 107.66873], phone_number: '5678901234', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Olivia Garcia', location: [17.58401, 106.18778], phone_number: '6789012345', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'James Davis', location: [13.57406, 108.18783], phone_number: '7890123456', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Emily Miller', location: [11.56411, 102.98788], phone_number: '8901234567', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Benjamin Wilson', location: [19.55416, 109.18793], phone_number: '9012345678', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Emma Moore', location: [15.96421, 108.18798], phone_number: '0123456789', id_user_data: Math.floor(Math.random() * 5) + 1 },
>>>>>>> origin/woller_branch_map
      ]);
    })
    .then(function(){
      return knex.raw("SELECT setval('individual_id_seq', (SELECT MAX(id) from individual))");
  });
}
