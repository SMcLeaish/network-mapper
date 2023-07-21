require = require('esm')(module);

exports.seed = async function(knex) {
  await knex('individual').del();

  const individuals = [
    { name: 'John Doe', location: [51.509865,-0.118092], phone_number: '1234567890' },
    { name: 'Jane Doe', location: [52.509865,-1.118092], phone_number: '2345678901' },
    { name: 'Robert Smith', location: [53.509865,-2.118092], phone_number: '3456789012' },
    { name: 'Sophia Johnson', location: [54.509865,-3.118092], phone_number: '4567890123' },
    { name: 'William Brown', location: [55.509865,-4.118092], phone_number: '5678901234' },
    { name: 'Olivia Garcia', location: [56.509865,-5.118092], phone_number: '6789012345' },
    { name: 'James Davis', location: [57.509865,-6.118092], phone_number: '7890123456' },
    { name: 'Emily Miller', location: [58.509865,-7.118092], phone_number: '8901234567' },
    { name: 'Benjamin Wilson', location: [59.509865,-8.118092], phone_number: '9012345678' },
    { name: 'Emma Moore', location: [60.509865,-9.118092], phone_number: '0123456789' },
  ];

  return knex('individual').insert(individuals);
};
