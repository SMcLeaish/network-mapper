exports.seed = function(knex) {
  return knex('individual').del()
    .then(function () {
      return knex('individual').insert([
        { name: 'John Doe', location: [13.0696,101.3901], phone_number: '1234567890', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Jane Doe', location: [18.7904, 98.9847], phone_number: '2345678901', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Robert Smith', location: [7.8804, 98.3923], phone_number: '3456789012', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Sophia Johnson', location: [12.5657, 99.9577], phone_number: '4567890123', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'William Brown', location: [9.5120, 100.0136], phone_number: '5678901234', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Olivia Garcia', location: [9.1393, 99.3217], phone_number: '6789012345', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'James Davis', location: [8.6913, 99.0773], phone_number: '7890123456', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Emily Miller', location: [14.0726, 99.8237], phone_number: '8901234567', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Benjamin Wilson', location: [8.0170, 98.8372], phone_number: '9012345678', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Emma Moore', location: [13.0696, 101.01], phone_number: '0123456789', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Truett Barr', location: [7.8804, 98.3923], phone_number: '7833333253', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Jazmine Herman', location: [18.7683, 98.9644], phone_number: '7627820982', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Juelz Suarez', location: [14.9359, 102.0738], phone_number: '0928709812', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Jase Pollard', location: [8.6382, 99.3612], phone_number: '1240165624', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Julien Beard', location: [12.6192, 101.4071], phone_number: '6576560965', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'William McIntyre', location: [16.8207, 100.2659], phone_number: '4523009788', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Darius Levy', location: [14.9359,101], phone_number: '3987677761', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Emely Frost', location: [13.2003, 101.7783], phone_number: '1436760000', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Rosalia Mason', location: [8.5379, 99.9213], phone_number: '1547650981', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Josephine Meza', location: [13.5204, 99.9277], phone_number: '0118770901', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Brandon Sanders', location: [14.0359, 101.0738], phone_number: '0928709812', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Leslie Correa', location: [14.9359, 104.0738], phone_number: '9827827899', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Legacy Kent', location: [14.82, 104.0738], phone_number: '0298655551', id_user_data: Math.floor(Math.random() * 5) + 1 },
        { name: 'Ryann Bautista', location: [14.9359, 100], phone_number: '0109675142', id_user_data: Math.floor(Math.random() * 5) + 1 },

      ]);
    })
    .then(function(){
      return knex.raw("SELECT setval('individual_id_seq', (SELECT MAX(id) from individual))");
  });
}