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
app.get('/entity/:name', (req, res) => {
  let { name } = req.params
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
})

app.get('/narratives/:id')

https.createServer(options, app).listen(port, () => {
  console.log('HTTPS server running on port 3001');
});