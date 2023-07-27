require('dotenv').config();
const knex = require('knex')(require('./knexfile.js')['development'])

async function startNetworkQuery(name) {
    try {
      let data = await knex.select('*')
        .from('individual')
        .where({ 'individual.name': name });
  
      if (data.length === 0) {
        data = await knex.select('entity.id AS id', 'organization.name AS orgName', 'organization.location AS organization_location', 'interaction.weight',
          'interaction.id_entity_1', 'interaction.id_entity_2', 'interaction.id_event', 'event.event_name',
          'event.location AS event_location', 'event.date AS event_date', 'event_type.type AS event_type', 'user_data.username', 'user_data.user_organization')
          .from('organization')
          .where({ 'organization.name': name })
          .join('entity', 'organization.id', 'entity.id_organization')
          .join('interaction', function () {
            this
              .on('id_entity_1', '=', 'entity.id')
              .orOn('id_entity_2', '=', 'entity.id')
          })
          .join('event', 'interaction.id_event', 'event.id')
          .join('event_type', 'event_type_id', 'event_type.id')
          .join('user_data', 'organization.id_user_data', 'user_data.id');
      } else {
        data = await knex.select('entity.id AS id', 'individual.name AS individualName', 'individual.location AS individual_location', 'interaction.weight',
          'interaction.id_entity_1', 'interaction.id_entity_2', 'interaction.id_event', 'event.event_name',
          'event.location AS event_location', 'event.date AS event_date', 'event_type.type AS event_type', 'user_data.username', 'user_data.user_organization')
          .from('individual')
          .join('entity', 'individual.id', 'entity.id_individual')
          .join('interaction', function () {
            this
              .on('interaction.id_entity_1', '=', 'entity.id')
              .orOn('interaction.id_entity_2', '=', 'entity.id')
          })
          .join('event', 'interaction.id_event', 'event.id')
          .join('event_type', 'event.event_type_id', 'event_type.id')
          .join('user_data', 'individual.id_user_data', 'user_data.id')
          .where({ 'individual.name': name });
      }
     return data; 
    } catch (error) {
      console.error(`An error occurred while querying the data: ${error.message}`);
      
    }
  }
 module.exports = startNetworkQuery;
