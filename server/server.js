require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const https = require('https');
const fs = require('fs');
const app = express();
const port = 3001;
const cookieParser = require('cookie-parser')
const uuid=require('uuid').v4
app.use(cookieParser())

app.use(cors());

app.use(express.json());
const sessions={}
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
  const test= req.headers.cookie.split('=')[1]
  console.log(test.split(";"))
   const usersession=test.split(";")[0]
  console.log(usersession)
  if(usersession)
    {
      knex('user_data')
    .select('*')
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(err))
 
}});

app.get('')

app.post('/users', async (req, res) => {
  
  
  console.log(req.body.password)
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(hashedPassword)
    const newUser = {
      username: req.body.username,
      hashed_password: hashedPassword,
      email: req.body.email,        
      user_organization: req.body.user_organization,
      distinguished_name: req.body.distinguished_name,
      cac_approved: req.body.cac_approved
    };
    console.log("newuser",newUser)
    knex('user_data')
    .where('username',req.body.username)
    .then(data => {
      console.log("inserting")
      if (data.length > 0) {
        res.status(404).json({userCreated: false, message: `Username: *${req.body.username}* already taken!`});
      } else {
        console.log("isnerting new user")
        knex('user_data')
          .insert(newUser)
          .then(() => {
            // set cookie any user info
            res.status(201).send( {success: req.cookies})
          })
          .catch(err => res.status(501).send(err))
      }
    })
  } 
  catch {
    res.status(500).send();
  }
});

app.post('/users/login', (req, res) => {
  const sessionId= uuid()
  const username =req.username
  const id =req.id;
  sessions[sessionId]={username,userId:id}
  res.cookie( 'session',sessionId,{secure:true, sameSite:"none"})
  // res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true })
  console.log("logging in cookie made")
  
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
              .on('interaction.id_entity_1', '=', 'entity.id')
              .orOn('interaction.id_entity_2', '=', 'entity.id')
          })
          .join('event', 'interaction.id_event', 'event.id')
          .join('event_type', 'event.event_type_id', 'event_type.id')
          .join('user_data', 'individual.id_user_data', 'user_data.id')
          .then((data) => res.status(200).json(data))
      } else {
        knex.select('entity.id AS organization_entity_id', 'organization.name', 'organization.location AS organization_location', 'interaction.weight', 
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



https.createServer(options, app).listen(port, () => {
  console.log('HTTPS server running on port 3001');
});