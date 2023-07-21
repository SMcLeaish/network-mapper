require = require('esm')(module /*, options*/);
const faker = require('@faker-js/faker').faker;


exports.seed = function(knex) {
  return knex('organization').del()
    .then(function () {
      const organizations = Array.from({ length: 10 }, () => {
        let latitude = faker.location.latitude()
        let longitude = faker.location.longitude()
        let location = [latitude, longitude]
        return {
          name: faker.company.name(),
          location: location
        };
      });
      return knex('organization').insert(organizations);
    });
};