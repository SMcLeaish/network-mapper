require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const https = require('https');
const fs = require('fs');
const app = express();
const port = 3001;

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
  const processedSet = new Set();
  const nodes = [];
  const edges = [];

  recursiveQuery(name, entitySet, nodes, edges, processedSet)
    .then(data => {
      res.json({nodes: data.nodes, edges: data.edges});
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred while fetching data.' });
      console.error(error);
    });
});

function buildEntitySet(data, entitySet) {
  data.forEach(item => {
    entitySet.add(item.id_entity_1);
    entitySet.add(item.id_entity_2);
  });
  return entitySet;
}
// FIX ME TO ADD ASSOCIATES
// function buildNodes(data, entitySet, nodes) {
  function buildNodes(data, nodes, processedSet) {
    data.forEach(item => {
      console.log(item);
      let id, type;
      if (item.organization_entity_id != undefined){
        id = item.organization_entity_id;
        type = 'organization';
      } else {
        id = item.individual_entity_id;
        type = 'individual';
      }
  
      
      if (processedSet.has(id)) {
        return;
      }
  
      let existingNode = nodes.find(node => node.id === id);
      if (existingNode) {
        existingNode.events.push(item.event_name);
      } else {
        const node = {
          id: id,
          type: type,
          name: item.name,
          individual_location: item.individual_location,
          //associates,
          events: [item.event_name],
        };
        nodes.push(node);
        processedSet.add(id);
        console.log('id:', id);
        console.log('Set: ', processedSet);
      }
    });
    return nodes;
  }
  
  

function buildEdges(data, edges) {
  data.forEach(item => {
    const edge = {
      source: item.id_entity_1,
      target: item.id_entity_2
    };
    edges.push(edge);
  });
  return edges;
}

async function queryNameFromID(entitySet) {
  const entityArray = Array.from(entitySet);
  const resultArray = [];

  for (let id of entityArray) {
    let data = await knex.select('*')
      .from('entity')
      .join('individual', 'entity.id_individual', 'individual.id')
      .where({ 'entity.id': id });

    if (data.length !== 0) {
      resultArray.push(data);
    } else {
      data = await knex.select('*')
        .from('entity')
        .join('organization', 'entity.id_organization', 'organization.id')
        .where({ 'entity.id': id });
      resultArray.push(data);
    }
  }
  return resultArray;
}


async function recursiveQuery(name, entitySet, nodes, edges, processedSet) {
  try {
    let data = await knex.select('*')
      .from('individual')
      .where({ 'individual.name': name });

    if (data.length === 0) {
      data = await knex.select('entity.id AS organization_entity_id', 'organization.name', 'organization.location AS organization_location', 'interaction.weight',
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
      data = await knex.select('entity.id AS individual_entity_id', 'individual.name', 'individual.location AS individual_location', 'interaction.weight',
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

    buildEntitySet(data, entitySet)
    
    console.log('EntitySet:', Array.from(entitySet));
    console.log('ProcessedNodes:', Array.from(processedSet));
    nodes = buildNodes(data, nodes, processedSet);
    if (Array.from(entitySet).every(node => processedSet.has(node))) {
      return { entitySet, nodes, edges };
    }
    edges = buildEdges(data, edges);
    const newData = await queryNameFromID(entitySet);

    const flatNewData = [].concat(...newData);
    const names = flatNewData.map(item => item.name);
    const results = [];
    for (let name of names) {
      const result = await recursiveQuery(name, entitySet, nodes, edges, processedSet);
      results.push(result);
    }

    return { nodes, edges, newData, results };

  } catch (error) {
    console.log(error);
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