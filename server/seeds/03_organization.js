exports.seed = async function(knex) {
  await knex('organization').del();

  const organizations = [
    { name: 'Interstellar Corp', location: [15.55426, 102.18803], organization_type_id: 2 },
    { name: 'StarTech Industries', location: [15.55431, 102.18808], organization_type_id: 2 },
    { name: 'Quantum Dynamics', location: [15.55436, 102.18813], organization_type_id: 2 },
    { name: 'Global Health Initiative', location: [15.55441, 102.18818], organization_type_id: 1 },
    { name: 'Education for All Foundation', location: [15.55446, 102.18823], organization_type_id: 1 },
    { name: 'Royal Thai Armed Forces - Unit 1', location: [15.55451, 102.18828], organization_type_id: 3 },
    { name: 'Royal Thai Armed Forces - Unit 2', location: [15.55456, 102.18833], organization_type_id: 3 },
  ];

  return knex('organization').insert(organizations);
};
