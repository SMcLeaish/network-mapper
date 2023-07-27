/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('position').del()
  await knex('position').insert([
    {individual_id: 1, organization_id: 1, role_id: 3},
    {individual_id: 2, organization_id: 2, role_id: 5},
    {individual_id: 3, organization_id: 3, role_id: 3},
    {individual_id: 4, organization_id: 4, role_id: 4},
    {individual_id: 5, organization_id: 5, role_id: 5},
    {individual_id: 6, organization_id: 6, role_id: 1},
    {individual_id: 7, organization_id: 7, role_id: 2},
    {individual_id: 8, organization_id: 1, role_id: 8},
    {individual_id: 9, organization_id: 2, role_id: 9},
    {individual_id: 10, organization_id: 3, role_id: 10},
  ]);
};
