require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const https = require('https');
const fs = require('fs');
const app = express();
const port = 3001;
const startNameQuery = require('./name_query');
const { eventNames } = require('process');
app.use(cors());
app.use(express.json());

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  ca: [
    fs.readFileSync(process.env.SSL_CA_ROOT_PATH),
    //      fs.readFileSync(process.env.SSL_LETSENCRYPT_CA_PATH)
  ],
  // requestCert: true, 
  // rejectUnauthorized: false 
};


const knex = require('knex')(require('./knexfile.js')['development'])


app.get('/network/:name', (req, res) => {
  const { name } = req.params;
  const nodes = [];
  const totalEntitiesSet = new Set();
  const processedSet = new Set();
  const edges = [];
  const names = [];
  startNetworkQuery(name, nodes, edges, totalEntitiesSet, processedSet, names)
    .then(() => {
      res.json({
        nodes: nodes,
        edges: edges,
        total: Array.from(totalEntitiesSet),
        processed: Array.from(processedSet),
        //names: names
      });
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred while fetching data.' });
      console.error(error);
    });
});

async function startNetworkQuery(name, nodes, edges, totalEntitiesSet, processedSet, names) {
  try {
    const rawData = await startNameQuery(name)
    const node = buildNodeObject(rawData)
    const nodeExists = nodes.some(existingNode => existingNode.id === node.id);

    if (!nodeExists) {
      nodes.push(node);
    }

    let associates = node.associates;
    console.log(associates)
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
    console.log(names)
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


  // Check if totalEntitiesSet and processedSet are equal
  if (setsAreEqual(totalEntitiesSet, processedSet)) {
    console.log("totalEntitiesSet and processedSet are equal");
    return;
  }

  // If the conditions are not met, call startNetworkQuery
  return await startNetworkQuery(name, nodes, edges, totalEntitiesSet, processedSet, names);

  // Call recursion function again
}

// Helper function to check if two sets are equal
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
    consolidatedData = {
      id: firstEntry.id,
      name: firstEntry[nameField],
      type: typeField,
      location: firstEntry.individual_location || firstEntry.org_location,
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
      // let data = await knex.select('*')
      //   .from('entity')
      //   .join('individual', 'entity.id_individual', 'individual.id')
      //   .where({ 'entity.id': id });

      // if (data.length !== 0) {
      //   resultArray.push(data);
      // } else {
      //   data = await knex.select('*')
      //     .from('entity')
      //     .join('organization', 'entity.id_organization', 'organization.id')
      //     .where({ 'entity.id': id });
      //   resultArray.push(data);
      // }
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

// async function queryAllNames(initialName) {
//   const results = [];
//   const namesQueue = [initialName];

//   while (namesQueue.length > 0) {
//     const currentName = namesQueue.shift();

//     try {
//       const { entitySet, nodes, edges, newData, names } = await recursiveQuery(currentName);

//       namesQueue.push(...names);

//       results.push({ entitySet, nodes, edges, newData });

//     } catch (error) {
//       console.log(`Error while processing name: ${currentName}`);
//       console.log(error);
//       // Decide how to handle the error
//     }
//   }

//   return results;
// }











app.get('/users', (req, res) => {
  knex('user_data')
    .select('*')
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(err))
});

app.post('/users', async (req, res) => {
  console.log("here")
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = {
      username: req.body.username,
      hashed_password: hashedPassword,
      email: req.body.email,
      user_organization: req.body.user_organization,
      distinguished_name: req.body.distinguished_name,
      cac_approved: req.body.cac_approved
    };
    console.log(newUser)
    knex('user_data')
      .where('username', req.body.username)
      .then(data => {
        if (data.length > 0) { // data
          res.status(404).json({ userCreated: false, message: `Username: *${req.body.username}* already taken!` });
        } else {
          knex('user_data')
            .insert(newUser)
            .then(() => res.status(201).send({ success: true }))
            .catch(err => res.status(501).send(err))
        }
      })

  }
  catch {
    res.status(500).send();
  }
});

app.post('/users/login', (req, res) => {
  knex('user_data')
    .select('*')
    .where('username', req.body.username)
    .then(data => {
      if (data.length > 0) {
        bcrypt.compare(req.body.password, data[0].hashed_password)
          .then(found => {
            if (found) {
              let responseObj = {
                userExists: found,
                ...data[0]
              }
              res.send(responseObj);
            } else {
              let responseObj = {
                userExists: found
              }
              res.send(responseObj);
            }
          })
          .catch(err => res.status(500).send(err));
      } else {
        // response if user is not found in DB
      }
    })
    .catch(err => res.status(500).send(err))
});

app.get('/narratives/:id', (req, res) => {
  let { id } = req.params;
  knex.select('*')
    .from('narrative')
    .where(function () {
      this.where({ 'id_entity': id }).orWhere({ 'id_event': id })
    })
    .then((data) => res.status(200).json(data))
})

app.get('/individuals', (req, res) => {
  knex.select('*')
    .from('individual')
    .then((data) => res.status(200).json(data))
})

app.get('/organizations', (req, res) => {
  knex.select('*')
    .from('organization')
    .then((data) => res.status(200).json(data))
})

app.get('/events', (req, res) => {
  knex.select('*')
    .from('event')
    .then((data) => res.status(200).json(data))
})

app.get('/position/:id', (req, res) => {
  let { id } = req.params;
  knex.select('position.id AS position_id', 'organization.name AS org_name', 'organization_type.type AS org_type', 'individual.name AS individual_name', 'role.title AS role_title', 'responsibilities.name AS responsibilities')
    .from('position')
    .where({ 'individual_id': id })
    .join('individual', 'position.individual_id', 'individual.id')
    .join('organization', 'position.organization_id', 'organization.id')
    .join('organization_type', 'organization.organization_type_id', 'organization_type.id')
    .join('role', 'position.role_id', 'role.id')
    .join('responsibilities', 'role.responsibilities_id', 'responsibilities.id')
    .then((data) => {
      if (data.length !== 0) {
        res.status(200).json(data)
      } else {
        knex.select('position.id AS position_id', 'individual.name AS individual_name', 'role.title AS role_title', 'responsibilities.name AS responsibilities')
          .from('position')
          .where({ 'individual_id': id })
          .join('individual', 'position.individual_id', 'individual.id')
          .join('role', 'position.role_id', 'role.id')
          .join('responsibilities', 'role.responsibilities_id', 'responsibilities.id')
          .then(otherData => res.status(200).json(otherData))
      }
    })
})

// app.get('/entity/:name', (req, res) => {
//   let { name } = req.params
//   knex.select('*')
//     .from('individual')
//     .where({'individual.name': name})
//     .then(data => {
//       if (data.length !== 0) {
//         knex.select('entity.id AS individual_entity_id', 'individual.name', 'individual.name AS other_name', 'individual.location AS individual_location', 'interaction.weight', 
//         'interaction.id_entity_1', 'interaction.id_entity_2', 'interaction.id_event', 'event.event_name', 
//         'event.location AS event_location', 'event.date AS event_date', 'event_type.type AS event_type', 'user_data.username', 'user_data.user_organization')
//           .from('individual')
//           .join('entity', 'individual.id', 'entity.id_individual')
//           .join('interaction', function() {
//             this 
//             .on('interaction.id_entity_1', '=', 'entity.id')
//             .orOn('interaction.id_entity_2', '=', 'entity.id')
//           })
//           .join('event', 'interaction.id_event', 'event.id')
//           .join('event_type', 'event.event_type_id', 'event_type.id')
//           .join('user_data', 'individual.id_user_data', 'user_data.id')
//           .where({'individual.name': name})
//           .then((data) => res.status(200).json(data))
//       } else {
//         knex.select('entity.id AS organization_entity_id', 'organization.name', 'organization.location AS organization_location', 'interaction.weight', 
//         'interaction.id_entity_1', 'interaction.id_entity_2', 'interaction.id_event', 'event.event_name', 
//         'event.location AS event_location', 'event.date AS event_date', 'event_type.type AS event_type', 'user_data.username', 'user_data.user_organization')
//           .from('organization')
//           .where({'organization.name': name})
//           .join('entity', 'organization.id', 'entity.id_organization')
//           .join('interaction', function() {
//             this 
//               .on('id_entity_1', '=', 'entity.id')
//               .orOn('id_entity_2', '=', 'entity.id')
//           })
//           .join('event', 'interaction.id_event', 'event.id')
//           .join('event_type', 'event_type_id', 'event_type.id')
//           .join('user_data', 'organization.id_user_data', 'user_data.id')
//           .then((data) => res.status(200).json(data))
//       }
//     })
// })

app.get('/entity/:name', (req, res) => {
  let { name } = req.params
  knex.select('*')
    .from('individual')
    .where({ 'individual.name': name })
    .then(data => {
      if (data.length !== 0) {
        knex.select('entity.id AS individual_entity_id', 'individual.name', 'individual.location AS individual_location', 'interaction.weight',
          'interaction.id_entity_1', 'interaction.id_entity_2', 'interaction.id_event', 'event.event_name',
          'event.location AS event_location', 'event.date AS event_date', 'event_type.type AS event_type', 'user_data.username AS event_data_username', 'user_data.user_organization AS event_data_useorg')
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
          .where({ 'individual.name': name })
          .then((data) => res.status(200).json(data))
      } else {
        knex.select('entity.id AS organization_entity_id', 'organization.name', 'organization.location AS organization_location', 'interaction.weight',
          'interaction.id_entity_1', 'interaction.id_entity_2', 'interaction.id_event', 'event.event_name',
          'event.location AS event_location', 'event.date AS event_date', 'event_type.type AS event_type', 'user_data.username AS event_data_username', 'user_data.user_organization AS  event_data_useorg')
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
          .join('user_data', 'organization.id_user_data', 'user_data.id')
          .then((data) => res.status(200).json(data))
      }
    })
})

app.get('/entity/id/:id', (req, res) => {
  let { id } = req.params
  knex.select('*')
    .from('entity')
    .join('individual', 'entity.id_individual', 'individual.id')
    .where({ 'entity.id': id })
    .then((data) => {
      if (data.length !== 0) {
        res.status(200).json(data)
      } else {
        knex.select('*')
          .from('entity')
          .join('organization', 'entity.id_organization', 'organization.id')
          .where({ 'entity.id': id })
          .then(data => res.status(200).json(data))
      }
    })
})


https.createServer(options, app).listen(port, () => {
  console.log('HTTPS server running on port 3001');
});