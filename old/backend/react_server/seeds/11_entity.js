exports.seed = function(knex) {
  // Define number of organizations and individuals
  const organizationCount = 7;
  const individualCount = 34;

  // Mapping to generate entries
  const organizationEntries = Array.from({ length: organizationCount }, (_, i) => ({
    id_organization: i + 1
  }));

  const individualEntries = Array.from({ length: individualCount }, (_, i) => ({
    id_individual: i + 1
  }));

  return knex('entity').del()
    .then(function () {
      return knex('entity').insert([
        ...organizationEntries,
        ...individualEntries
      ]);
    })
    .then(function(){
      return knex.raw("SELECT setval('entity_id_seq', (SELECT MAX(id) from entity))");
    });
};
