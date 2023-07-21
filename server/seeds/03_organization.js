import { faker } from '@faker-js/faker';

exports.seed = function(knex) {
  return knex('organization').del()
    .then(function () {
      const organizations = Array.from({ length: 10 }, () => {
        return {
          name: faker.company.name()
        };
      });
      return knex('organization').insert(organizations);
    });
};