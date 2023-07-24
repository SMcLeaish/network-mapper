exports.seed = function(knex) {
  return knex('individual').del()
    .then(function () {
      return knex('individual').insert([
        { name: 'John Doe', location: [15.55376, 102.18753], phone_number: '1234567890' },
        { name: 'Jane Doe', location: [15.55381, 102.18758], phone_number: '2345678901' },
        { name: 'Robert Smith', location: [15.55386, 102.18763], phone_number: '3456789012' },
        { name: 'Sophia Johnson', location: [15.55391, 102.18768], phone_number: '4567890123' },
        { name: 'William Brown', location: [15.55396, 102.18773], phone_number: '5678901234' },
        { name: 'Olivia Garcia', location: [15.55401, 102.18778], phone_number: '6789012345' },
        { name: 'James Davis', location: [15.55406, 102.18783], phone_number: '7890123456' },
        { name: 'Emily Miller', location: [15.55411, 102.18788], phone_number: '8901234567' },
        { name: 'Benjamin Wilson', location: [15.55416, 102.18793], phone_number: '9012345678' },
        { name: 'Emma Moore', location: [15.55421, 102.18798], phone_number: '0123456789' },
      ]);
    })
    .then(function(){
      return knex.raw("SELECT setval('individual_id_seq', (SELECT MAX(id) from individual))");
  });
}
