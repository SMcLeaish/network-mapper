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
    .where('username',req.body.username)
    .then(data => {
      if (data.length > 0){ // data
        res.status(404).json({userCreated: false, message: `Username: *${req.body.username}* already taken!`});
      } else{
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
    .where(function() {
      this.where({'id_entity': id}).orWhere({'id_event': id})
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
  knex.select('position.id AS position_id', 'organization.name AS org_name', 'organization_type.type AS org_type','individual.name AS individual_name', 'role.title AS role_title', 'responsibilities.name AS responsibilities')
    .from('position')
    .where({'individual_id': id})
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
          .where({'individual_id': id})
          .join('individual', 'position.individual_id', 'individual.id')
          .join('role', 'position.role_id', 'role.id')
          .join('responsibilities', 'role.responsibilities_id', 'responsibilities.id')
          .then(otherData => res.status(200).json(otherData))
      }
    })
})

app.get('/biography/:id', (req, res) => {
  let { id } = req.params;
  knex.select('entity.id AS entity_id', 'organization.id AS org_id', 'name', 'type', 'mgrs')
    .from('entity')
    .where('entity.id', id)
    .join('organization', 'id_organization', 'organization.id')
    .join('organization_type', 'organization_type_id', 'organization_type.id')
    .then(data => {
      if (data.length > 0) {
        res.status(200).json(data)
      } else {
        knex.select('entity.id AS entity_id', 'individual.id AS individual_id', 'individual.name AS individual_name',
          'role.title AS job_title', 'responsibilities.name AS job_responsibilities', 'individual.location AS individual_location', 'individual.id_user_data', 'organization.id AS org_id', 'organization.name AS org_name',
        )
          .from('entity')
          .where('entity.id', id)
          .join('individual', 'entity.id_individual', 'individual.id')
          .join('position', 'position.individual_id', 'individual.id')
          .join('organization', 'position.organization_id', 'organization.id')
          .join('organization_type', 'organization_type_id', 'organization_type.id')
          .join('role', 'position.role_id', 'role.id')
          .join('responsibilities', 'role.responsibilities_id', 'responsibilities.id')
          .then((data) => res.status(200).json(data))
      }
    })
})


app.get('/entity/:name', (req, res) => {
  let { name } = req.params
  knex.select('*')
    .from('individual')
    .where({'individual.name': name})
    .then(data => {
      if (data.length !== 0) {
        knex.select('entity.id AS individual_entity_id', 'entity.id AS primary_entity_id','individual.id AS individual_id','interaction.id AS interaction_id', 'individual.name AS individual_name', 'individual.location AS individual_location', 'interaction.weight', 
        'interaction.id_entity_1', 'interaction.id_entity_2', 'interaction.id_event', 'event.event_name', 
        'event.location AS event_location', 'event.date AS event_date', 'event_type.type AS event_type', 'user_data.username', 'user_data.user_organization')
          .from('individual')
          .join('entity', 'individual.id', 'entity.id_individual')
          .join('interaction', function() {
            this 
            .on('interaction.id_entity_1', '=', 'entity.id')
            .orOn('interaction.id_entity_2', '=', 'entity.id')
          })
          .join('event', 'interaction.id_event', 'event.id')
          .join('event_type', 'event.event_type_id', 'event_type.id')
          .join('user_data', 'individual.id_user_data', 'user_data.id')
          .where({'individual.name': name})
          .then((data) => res.status(200).json(data))
      } else {
        knex.select('entity.id AS organization_entity_id', 'entity.id AS primary_entity_id', 'organization.id AS org_id', 'interaction.id AS interaction_id', 'organization.name', 'organization.location AS organization_location', 'interaction.weight', 
        'interaction.id_entity_1', 'interaction.id_entity_2', 'interaction.id_event', 'event.event_name', 
        'event.location AS event_location', 'event.date AS event_date', 'event_type.type AS event_type', 'user_data.username', 'user_data.user_organization')
          .from('organization')
          .where({'organization.name': name})
          .join('entity', 'organization.id', 'entity.id_organization')
          .join('interaction', function() {
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

app.get('/entity', (req, res) => {
  let { array } = req.body
  knex.select('*')
    .from('individual')
    .whereIn('name', array)
    .then(data => res.status(200).json(data))
})

app.get('/entity/id/:id', (req, res) => {
  let { id } = req.params
  knex.select('*')
    .from('entity')
    .join('individual', 'entity.id_individual', 'individual.id')
    .where({'entity.id': id})
    .then((data) => {
      if (data.length !== 0) {
        res.status(200).json(data)
      } else {
        knex.select('*')
          .from('entity')
          .join('organization', 'entity.id_organization', 'organization.id')
          .where({'entity.id': id})
          .then(data => res.status(200).json(data))
      }
    })
})

app.get('/relationships/:id', (req, res) => {
    let { id } = req.params
    let entityIds = [];
    let returnData = [];
    knex.select('*')
      .from('interaction')
      .where({'interaction.id_entity_1': id})
      .orWhere({'interaction.id_entity_2': id})
      .then(data => {
        let allIds = []
        data.forEach(e => {
          allIds.push(e.id_entity_1)
          allIds.push(e.id_entity_2)
        })
        entityIds = allIds.filter(eId => eId !== parseInt(id))
      })
      .then(() => {
        knex.select('entity.id AS entity_id', '*')
          .from('entity')
          .join('individual', 'entity.id_individual', 'individual.id')
          .whereIn('entity.id', entityIds)
          .then(data => {
            data.forEach(e => returnData.push(e))
          })
          .then(() => {
            knex.select('entity.id AS entity_id', '*')
              .from('entity')
              .join('organization', 'entity.id_organization', 'organization.id')
              .whereIn('entity.id', entityIds)
              .then(data => {
                data.forEach(e => returnData.push(e))
                res.status(200).json(returnData)
              })
          })
      })
})

app.post('/interaction', (req, res) => {
  knex('interaction')
    .insert(req.body)
    .then(() => res.status(201).json({message: 'Interaction has been added'}))
})

app.delete('/interaction', (req, res) => {
  let { id_entity_1, id_entity_2 } = req.body;
  knex('interaction')
    .whereIn('id_entity_1', [id_entity_1, id_entity_2])
    .whereIn('id_entity_2', [id_entity_1, id_entity_2])
    .del()
    .then(() => res.status(201).json({message: 'Interaction has been deleted'}))
})


https.createServer(options, app).listen(port, () => {
  console.log('HTTPS server running on port 3001');
});