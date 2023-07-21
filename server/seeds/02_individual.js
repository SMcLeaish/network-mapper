import { faker } from '@faker-js/faker';

exports.seed = function(knex) {
  return knex('individual').del()
    .then(function () {
      const individuals = Array.from({ length: 10 }, () => {
        return {
          name: faker.person.fullName()
        };
      });
      return knex('individual').insert(individuals);
    });
};