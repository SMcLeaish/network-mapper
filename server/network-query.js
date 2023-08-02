require('dotenv').config();
const mgrs = require('mgrs');
const knex = require('knex')
(require('./knexfile.js')['development'])

async function startNameQuery(name) {
    try {
      let data = await knex.select('*')
        .from('individual')
        .where({ 'individual.name': name });
  
      if (data.length === 0) {
        data = await knex.select('entity.id AS id', 'organization.name AS orgName', 'organization.organization_type_id AS orgType', 'organization.location AS organization_location', 'interaction.weight',
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
  async function startNetworkQuery(name, nodes, edges, totalEntitiesSet, processedSet, names) {
    try {
      const rawData = await startNameQuery(name)
      const node = buildNodeObject(rawData)
      const nodeExists = nodes.some(existingNode => existingNode.id === node.id);
  
      if (!nodeExists) {
        nodes.push(node);
      }
  
      let associates = node.associates;
  
      associates.forEach(item => totalEntitiesSet.add(item))
      totalEntitiesSet.add(node.id)
      node.associates.forEach(associate => {
        const edgeExists = edges.some(edge =>
          (edge.source === node.id && edge.target === associate) ||
          (edge.source === associate && edge.target === node.id)
        );
  
        if (!edgeExists) {
          edges.push({ source: node.id, target: associate });
        }
      });
      processedSet.add(node.id)
      let totalEntitiesArray = Array.from(totalEntitiesSet);
      let processedArray = Array.from(processedSet);
      let differencesArray = totalEntitiesArray.filter(x => !processedArray.includes(x));
      let queryResults = await Promise.all(differencesArray.map(id => queryNameByID(id)));
      queryResults = queryResults.flat();
      queryResults = queryResults.filter(entity => !processedSet.has(entity.id));
      names.push(...queryResults);
      if (names.length > 0) {
        let newEntry = names.shift();
        let newName = newEntry[0].name;
        console.log(newName, typeof (newName))
        await recursionFunction(newName, nodes, edges, totalEntitiesSet, processedSet, names);
      }
      return { nodes, edges, total: Array.from(totalEntitiesSet), processed: Array.from(processedSet) };
  
  
  
    } catch (error) {
      console.error({ error: 'An error occurred while fetching data.' })
    }
  }
  
  async function recursionFunction(name, nodes, edges, totalEntitiesSet, processedSet, names) {
    if (!name || !nodes || !edges || !totalEntitiesSet || !processedSet || !names || name.length === 0) {
      console.log("One of the parameters is undefined or newNames is empty");
      return;
    }
  
  
    if (setsAreEqual(totalEntitiesSet, processedSet)) {
      console.log("totalEntitiesSet and processedSet are equal");
      return;
    }
  
    return await startNetworkQuery(name, nodes, edges, totalEntitiesSet, processedSet, names);
  }
  
  function setsAreEqual(setA, setB) {
    console.log('Set A: ', setA, 'Set B: ', setB)
    if (setA.size !== setB.size) {
      return false;
    }
  
    for (let item of setA) {
      if (!setB.has(item)) {
        return false;
      }
    }
  
    return true;
  }
  
  function buildNodeObject(data) {
    let consolidatedData = {};
  
    if (data.length > 0) {
      let firstEntry = data[0];
      let nameField = firstEntry.individualName ? 'individualName' : 'orgName';
      let typeField = firstEntry.individualName ? 'individual' : 'organization';
      let organizationType = firstEntry.orgType;
      let location = firstEntry.individual_location || firstEntry.organization_location;
      let latitude = location[0]
      let longitude = location[1]
      let revlocation = [...location].reverse();
      let mgrsDigits = mgrs.forward(revlocation)
      console.log(firstEntry.name, 'location: ',firstEntry.location, 'mgrs: ', mgrsDigits)
      consolidatedData = {
        id: firstEntry.id,
        name: firstEntry[nameField],
        type: typeField,
        organizationType: organizationType,
        latitude: latitude,
        longitude: longitude,
        location: location,
        mgrs: mgrsDigits,
        weight: firstEntry.weight,
        username: firstEntry.username,
        user_organization: firstEntry.user_organization,
        event_data: [],
        associates: new Set()
      };
    }
  
    data.forEach(entry => {
      consolidatedData.event_data.push({
        event_id: entry.id_event,
        event_name: entry.event_name,
        event_location: entry.event_location,
        event_date: entry.event_date,
        event_type: entry.event_type
      });
  
      consolidatedData.associates.add(entry.id_entity_1);
      consolidatedData.associates.add(entry.id_entity_2);
    });
    consolidatedData.associates = Array.from(consolidatedData.associates).filter(id => id !== consolidatedData.id);
    return consolidatedData;
  }
  async function queryNameByID(id) {
    try {
      const entityArray = [id]
      const resultArray = [];
  
      for (let id of entityArray) {
        let data = await knex.select('entity.id as entity_id', 'individual.*')
          .from('entity')
          .join('individual', 'entity.id_individual', 'individual.id')
          .where({ 'entity.id': id });
  
        if (data.length !== 0) {
          resultArray.push(data);
        } else {
          data = await knex.select('entity.id as entity_id', 'organization.*')
            .from('entity')
            .join('organization', 'entity.id_organization', 'organization.id')
            .where({ 'entity.id': id });
          resultArray.push(data);
        }
      }
      return resultArray;
    } catch {
      console.error({ error: 'An error occurred while fetching data.' })
    }
  }
  module.exports = {startNetworkQuery}
 