const express = require('express');
const cors = require('cors');
// const knex = require('knex')(require('./knexfile.js')['development']);
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());


const knex = require('knex')(require('./knexfile.js')['development'])

app.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = {
      username: req.body.username,
      password: hashedPassword
    };
    knex('user_account')
      .insert(newUser)
      .then(() => res.status(201).send({ success: true }))
      .catch(err => res.status(501).send(err))
  } catch {
    res.status(500).send();
  }
});

app.post('/users/login', (req, res) => {
  knex('user_account')
    .select('*')
    .where('username', req.body.username)
    .then(data => {
      if (data.length > 0) {
        bcrypt.compare(req.body.password, data[0].password)
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

// app.get('/entity/:name', (req, res) => {
//   let { name } = req.params
//   knex.select('entity.id AS individual_entity_id', 'individual.name', 'individual.location AS individual_location', 'interaction.weight', 
//   'interaction.id_entity_1', 'interaction.id_entity_2', 'interaction.id_event', 'event.event_name', 
//   'event.location AS event_location', 'event.date AS event_date', 'event_type.type AS event_type', 'user_data.username', 'user_data.user_organization')
//     .from('individual')
//     .where({'individual.name': name})
//     .join('entity', 'individual.id', 'entity.id_individual')
//     .join('interaction', function() {
//       this 
//         .on('id_entity_1', '=', 'entity.id')
//         .orOn('id_entity_2', '=', 'entity.id')
//     })
//     .join('event', 'interaction.id_event', 'event.id')
//     .join('event_type', 'event_type_id', 'event_type.id')
//     .join('user_data', 'individual.id_user_data', 'user_data.id')
//     .then((data) => res.status(200).json(data))
// })

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

app.get('/entity/:name', (req, res) => {
  let { name } = req.params
  knex.select('*')
    .from('individual')
    .where({'individual.name': name})
    .then(data => {
      if (data.length !== 0) {
        knex.select('entity.id AS individual_entity_id', 'individual.name', 'individual.location AS individual_location', 'interaction.weight', 
        'interaction.id_entity_1', 'interaction.id_entity_2', 'interaction.id_event', 'event.event_name', 
        'event.location AS event_location', 'event.date AS event_date', 'event_type.type AS event_type', 'user_data.username', 'user_data.user_organization')
          .from('individual')
          .where({'individual.name': name})
          .join('entity', 'individual.id', 'entity.id_individual')
          .join('interaction', function() {
            this 
              .on('id_entity_1', '=', 'entity.id')
              .orOn('id_entity_2', '=', 'entity.id')
          })
          .join('event', 'interaction.id_event', 'event.id')
          .join('event_type', 'event_type_id', 'event_type.id')
          .join('user_data', 'individual.id_user_data', 'user_data.id')
          .then((data) => res.status(200).json(data))
      }
    })
})


app.listen(port, () => console.log(`Server running on port: ${port}`));