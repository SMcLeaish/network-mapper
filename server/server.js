require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const https = require('https');
const fs = require('fs');
const nodemailer = require('nodemailer')
const app = express();
const port = 3001;
const { startNetworkQuery } = require('./network-query');




let corsOptions = {
  origin: 'http://localhost:3000',  //front end url
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
}
app.use(cors(corsOptions));
app.use(express.json());

const crypto = require("crypto")
const cookieParser = require('cookie-parser')
const uuid = require('uuid').v4

app.use(cookieParser())



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
        //names: names
      });
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred while fetching data.' });
      console.error(error);
    });
});

// setting up the method to send the email
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

app.get('/cookietest', (req, res) => {
  if (req.headers.cookie) {
    let stored = req.headers.cookie.split('=')[1]
    knex('user_data')
      .select('*')
      .where('session_cookie', stored)
      .then(found => {
        if (found) {
          res.json({ success: true, data: found })
        } else {

          res.send({ success: false })
        }
      })
  } else {
    res.send({ success: false })
  }
})



app.get('/users', (req, res) => {

  knex('user_data')
    .select('*')
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(err))

});

// creating the new user and sends them an email for verification

app.post('/users', async (req, res) => {

  // token for the email params unique everytime and secure, goes in the mailing options
  let token = crypto.randomBytes(64).toString("hex")
  const link = `${process.env.BASE_URL}/users/confirm/?emailToken=${token}`;
  let mailOptions = {
    from: req.body.email,
    to: req.body.email,
    subject: "User Verify",
    text: link,
  };

  //sends the email

  transporter.sendMail(mailOptions, link)

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    const newUser = {
      username: req.body.username,
      hashed_password: hashedPassword,
      email: req.body.email,
      user_organization: req.body.user_organization,
      distinguished_name: req.body.distinguished_name,
      cac_approved: req.body.cac_approved,
      emailToken: token,
      isVerified: false
    };
    knex('user_data')
      .where('username', req.body.username)
      .then(data => {

        if (data.length > 0) {
          res.status(404).json({ userCreated: false, message: `Username: *${req.body.username}* already taken!` });
        } else {

          knex('user_data')
            .insert(newUser)
            .then(() => {
              // set cookie any user info
              res.status(201).send({ success: req.cookies })
            })
            .catch(err => res.status(501).send(err))
        }
      })
  }
  catch {
    res.status(500).send();
  }
});



app.put('/users/cookie', (req, res) => {

  knex('user_data')
    .where('username', req.body.username)
    .update({ session_cookie: req.headers.cookie.split('=')[1] })
    .then((rowCount) => {
      if (rowCount === 0) {
        return res.status(404).json({
          success: false,
        });
      }
      res.status(200).json({
        success: true,
        data: rowCount
      });
    })
    .catch((err) =>
      res.status(500).json({
        message: 'An error occurred while updating the user session cookie',
        error: err,
      })
    );
})


// logs in the user and makes sure they are verified, if verified a session cookie is created
// app.post('/users/login', (req, res) => {
//   const sessionId = uuid()
//   knex('user_data')
//     .select('*')
//     .where('username', req.body.username)
//     .then(data => {
//       if (data.length > 0) {
//         bcrypt.compare(req.body.password, data[0].hashed_password)
//           .then(found => {
//             if (found && data[0].isVerified) {

//               res.cookie('session', sessionId, {

//                 httpOnly: true,
//                 secure: true,
//                 sameSite: 'none',
//                 path: '/',
//                 expires: 0,
//                 signed: false,
//               })




//               let responseObj = {
//                 userExists: found,
//                 ...data[0]
//               }
//               console.log(responseObj)
//               res.send(responseObj);
//             } else if (!found) {

//               let responseObj = {
//                 userExists: false
//               }
//               console.log(responseObj)
//               res.send(responseObj);
//             }
//           })
//           .catch(err => res.status(500).send(err));
//       }
//       else {
//         let responseObj = {
//           userExists: false
//         }
//         console.log(responseObj)
//         res.send(responseObj);
//       }
//     })
//     .catch(err => res.status(500).send(err))
// });
app.post('/users/login', (req, res) => {
  const sessionId = uuid();
  knex('user_data')
    .select('*')
    .where('id', 1) // fetch user with id 1
    .then(data => {
      if (data.length > 0) {
        res.cookie('session', sessionId, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          path: '/',
          expires: 0,
          signed: false,
        });

        let responseObj = {
          userExists: true,
          ...data[0]
        }
        console.log(responseObj)
        res.send(responseObj);
      }
      else {
        let responseObj = {
          userExists: false
        }
        console.log(responseObj)
        res.send(responseObj);
      }
    })
    .catch(err => res.status(500).send(err))
});


// this will verify the user and update the 2 object fields
app.put('/users/:id', (req, res) => {
  console.log("verified")
  knex('user_data')
    .where('id', req.body.id)
    .update({ emailToken: null, isVerified: true })
    .then((rowCount) => {
      if (rowCount === 0) {
        return res.status(404).json({
          message: 'user not found',
        });
      }
      res.status(200).json({
        message: 'user updated successfully',
      });
    })
    .catch((err) =>
      res.status(500).json({
        message: 'An error occurred while updating the user',
        error: err,
      })
    );
})



app.get('/narratives/entity/:id', (req, res) => {
  let { id } = req.params;
  knex.select('*', 'narrative.id AS narr_id')
    .from('narrative')
    .where({ 'id_entity': id })
    .then((data) => res.status(200).json(data))
})

app.get('/narratives/event/:id', (req, res) => {
  let { id } = req.params;
  knex.select('*', 'narrative.id AS narr_id')
    .from('narrative')
    .where({ 'id_event': id })
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
    .where({ 'individual.name': name })
    .then(data => {
      if (data.length !== 0) {
        knex.select('entity.id AS individual_entity_id', 'entity.id AS primary_entity_id', 'individual.id AS individual_id', 'interaction.id AS interaction_id', 'individual.name AS individual_name', 'individual.location AS individual_location', 'interaction.weight',
          'interaction.id_entity_1', 'interaction.id_entity_2', 'interaction.id_event', 'event.event_name',
          'event.location AS event_location', 'event.date AS event_date', 'event_type.type AS event_type', 'user_data.username', 'user_data.user_organization')
          // knex.select('*')
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
        knex.select('entity.id AS organization_entity_id', 'entity.id AS primary_entity_id', 'organization.id AS org_id', 'interaction.id AS interaction_id', 'organization.name', 'organization.location AS organization_location', 'interaction.weight',
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
app.get('/relationships/:id', (req, res) => {
  let { id } = req.params
  let entityIds = [];
  let returnData = [];
  knex.select('*')
    .from('interaction')
    .where({ 'interaction.id_entity_1': id })
    .orWhere({ 'interaction.id_entity_2': id })
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
https
app.post('/interaction', (req, res) => {
  knex('interaction')
    .insert(req.body)
    .then(() => res.status(201).send({ message: 'Interaction has been added' }))
})

app.delete('/interaction', (req, res) => {
  let { id_entity_1, id_entity_2 } = req.body;
  knex('interaction')
    .whereIn('id_entity_1', [id_entity_1, id_entity_2])
    .whereIn('id_entity_2', [id_entity_1, id_entity_2])
    .del()
    .then(() => res.status(201).json({ message: 'Interaction has been deleted' }))
})

app.post('/narrative', (req, res) => {
  let body = req.body
  console.log(body)
  knex('narrative')
    .insert(body)
    .then(() => res.status(201).json({ message: 'Narrative has been added' }))
})

app.delete('/narrative/:string', (req, res) => {
  let { string } = req.params
  knex('narrative')
    .where({ 'narrative_string': string })
    .del()
    .then(() => res.status(200).send({ message: 'Narrative was deleted' }))
})

app.get('/event/:id', (req, res) => {
  let { id } = req.params
  let dataToReturn = []
  let individuals = []
  let orgs = []
  let attendies = []
  knex.select('event.id AS event_id', 'event_name', 'event.date AS event_date', 'event.location AS event_location', 'event_type.type', 'id_entity_1', 'id_entity_2')
    .from('event')
    .where({ 'event.id': id })
    .join('event_type', 'event.event_type_id', 'event_type.id')
    .join('interaction', 'event.id', 'interaction.id_event')
    .then((data) => {
      let { id_entity_1, id_entity_2, ...mainEvent } = data[0]
      dataToReturn.push(mainEvent)
      data.forEach(e => {
        attendies.push(e.id_entity_1); attendies.push(e.id_entity_2)
      })
      attendies = [...new Set(attendies)]
      knex.select('*')
        .from('entity')
        .whereIn('entity.id', attendies)
        .then(data => {
          data.forEach(e => {
            if (e.id_individual) individuals.push(e.id_individual)
          })
          data.forEach(e => {
            if (e.id_organization) orgs.push(e.id_organization)
          })
          knex.select('individual.id AS individual_id', 'individual.name AS primary_name')
            .from('individual')
            .whereIn('individual.id', individuals)
            .then(data => {
              data.forEach(e => dataToReturn.push(e))
              knex.select('organization.id AS organization_id', 'organization.name AS primary_name')
                .from('organization')
                .whereIn('organization.id', orgs)
                .then(data => {
                  data.forEach(e => dataToReturn.push(e))
                  res.status(200).json(dataToReturn);
                })
            })
        })
    })
    .catch(err => res.status(400).send({ message: 'This event does not exist or no one attended it' }))
})

app.post('/entity', (req, res) => {
  let { user_id, association, organization, events, narrative, date, indOrOrg, phonenumber, location, orgType, eventType } = req.body
  console.log(location)
  let event_true;
  let event_id;
  let individual_id;
  let organization_id;
  let eventTypeId;
  let orgTypeId;
  let Organization;
  let eventField
  let entity_id;
  
  if(narrative.length < 1){
    narrative=`Created on ${date}`;
  }
  console.log("this is the indOrOrg", indOrOrg)
  knex('event')
    .select('*')
    .where('event_name', events)
    .then(data => {
      if (data.length > 0) {

        console.log("im in events")
        event_true = true
        event_id = data[0].id
      }
      else {

        event_true = false
      }
    }).then(() => {
      if (event_true == false) {
        console.log("the event does now exist", event_true)
        knex('event_type')
          .select('*')
          .where('type', eventType)
          .then(data => {
            if (data.length > 0) {

              eventTypeId = data[0].id

              let eventField = {
                event_name: events,
                date: date,
                location: location,
                event_type_id: eventTypeId,
                id_user_data: user_id
              }
              knex('event')
                .select('*')
                .insert(eventField, ['id'])
                .then(data => {
                  event_id = data[0].id
                  res.status(200)
                })
            }
            else {
              knex('event_type')
                .select('*')
                .insert({ type: eventType }, ['id'])
                .then(data => {

                  eventTypeId = data[0].id

                  eventField = {
                    event_name: events,
                    date: date,
                    location: location,
                    event_type_id: eventTypeId,
                    id_user_data: user_id
                  }
                  knex('event')
                    .select('*')
                    .insert(eventField, ['id'])
                    .then(data => {
                      event_id = data[0].id
                      res.status(200)
                    })

                })
            }
          })
          .then(() => {

            if (indOrOrg == true) {
              console.log("i'm making an individual", indOrOrg)
              let individual = {
                name: organization,
                location: location,
                phone_number: phonenumber,
                id_user_data: user_id,
                

              }
              knex('individual')
                .select('*')
                .insert(individual, ['id'])
                .then(data => {
                  console.log("individual data", data)
                  individual_id = data[0].id;
                  res.status(201).send({ success: true })
                })
                .then(() => {
                  knex('entity')
                    .select('*')
                    .insert({
                      id_individual: individual_id,
                      id_organization: null
                    }, ['id']).then(data => {
                      entity_id=data[0].id;
                      let narrativeField = {
                        user_data_id: user_id,
                        date: date,
                        narrative_string: narrative,
                        id_entity: data[0].id,
                        id_event: event_id
                      }
                      knex('narrative')
                        .select('*')
                        .insert(narrativeField)
                        .then(() => console.log("added"))
                    }).then(() => {
                      console.log("I am in interaction")
                      console.log("I am in interaction")
                      knex('interaction')
                      
                        .select('*')
                        .insert({weight: 1, id_entity_1: entity_id, id_entity_2: 1, id_event: event_id})
                        .then(()=>res.status(200))
                    })

                })

            }
            else if(indOrOrg==false) {
              console.log("i'm making an organization", indOrOrg)
              let orgTypeId;
              knex('organization_type')
                .select('*')
                .where('type', orgType)
                .then(data => {
                  if (data.length > 0) {

                    orgTypeId = data[0].id

                  }
                  else {
                    knex('organization_type')
                      .select('*')
                      .insert({ type: orgType }, ['id'])
                      .then(data => {
                        console.log("starting to create organization")
                        orgTypeId = data[0].id;
                        Organization = {
                          name: organization,
                          location: location,
                          organization_type_id: orgTypeId,
                          id_user_data: user_id,
                          
                        }
                        knex('organization')
                          .select('*')
                          .insert(Organization, ['id'])
                          .then(data => {

                            organization_id = data[0].id

                          })
                      })
                  }
                })
                .then(() => {
                  console.log("entity")
                  knex('entity')
                    .select('*')
                    .insert({
                      id_organization: organization_id,
                      id_individual: null
                    }, ['id']).then(data => {
                      entity_id=data[0].id;
                      let narrativeField = {
                        user_data_id: user_id,
                        date: date,
                        narrative_string: narrative,
                        id_entity: data[0].id,
                        id_event: event_id
                      }
                      knex('narrative')
                        .select('*')
                        .insert(narrativeField)
                        .then(() => console.log("added"))
                    })
                    .then(() => {
                      
                      knex('interaction')
                      
                        .select('*')
                        .insert({weight: 1, id_entity_1: entity_id, id_entity_2: 1, id_event: event_id})
                        .then(()=>res.status(200))
                    })
                })



            }

          })



      }
      else if ((event_true == true) && (indOrOrg == true)) {
        individual = {
          name: organization,
          location: location,
          phone_number: phonenumber,
          id_user_data: user_id,
          

        }
        
        knex('individual')
          .select('*')
          .insert(individual, ['id'])
          .then(data => {
            individual_id = data[0].id
            res.status(201).send({ success: true })
          })
          .then(() => {
                console.log("entity")
                knex('entity')
                  .select('*')
                  .insert({
                    id_individual: individual_id,
                    id_organization: null
                  }, ['id'])
                  .then(data => {
                    entity_id=data[0].id;
                    let narrativeField = {
                      user_data_id: user_id,
                      date: date,
                      narrative_string: narrative,
                      id_entity: data[0].id,
                      id_event: event_id
                    }
                    knex('narrative')
                      .select('*')
                      .insert(narrativeField)
                      .then(() => console.log("added"))
                  }).then(()=>{
                    console.log("interacting")
                    knex('interaction')
                      .select('*')
                      .insert({weight: 1, id_entity_1: entity_id, id_entity_2: 1, id_event: event_id})
                      .then(()=>res.status(200))
                  })
              
          })
              
          
      }
      else if ((event_true == true) && (indOrOrg == false)) {
        let orgTypeId;
        console.log("i am creating an organization")
        knex('organization_type')
          .select('*')
          .where('type', orgType)
          .then(data => {
            if (data.length > 0) {

              orgTypeId = data[0].id

            }
            else {
              knex('organization_type')
                .select('*')
                .insert({ type: orgType }, ['id'])
                .then(data => {

                  orgTypeId = data[0].id

                })
            }
          }).then(() => {

            Organization = {
              name: organization,
              location: location,
              organization_type_id: orgTypeId,
              id_user_data: user_id,
              
            }
            knex('organization')
              .select('*')
              .insert(Organization, ['id'])
              .then(data => {

                organization_id = data[0].id

              })
              .then(() => {
                console.log("entity")
                knex('entity')
                  .select('*')
                  .insert({
                    id_organization: organization_id,
                    id_individual: null
                  }, ['id'])
                  .then(data => {
                    entity_id=data[0].id;
                    let narrativeField = {
                      user_data_id: user_id,
                      date: date,
                      narrative_string: narrative,
                      id_entity: data[0].id,
                      id_event: event_id
                    }
                    knex('narrative')
                      .select('*')
                      .insert(narrativeField)
                      .then(() => console.log("added"))
                  })
                  .then(()=>{
                    console.log("interacting")
                    knex('interaction')
                     
                      .select('*')
                      .insert({weight: 1, id_entity_1: entity_id, id_entity_2: 1, id_event: event_id})
                      .then(()=>res.status(200))
                  })
              })

          })

      }

    })

})

app.get('/organizations/type', (req, res) => {
  knex('organization_type')
    .select('*')
    .then(data => res.status(200).send(data))
})

app.get('/events/types', (req, res) => {
  knex('event_type')
    .select('*')
    .then(data => res.status(200).send(data))
})

app.get('/narratives', (req, res) => {
  knex('narrative')
    .select('*')
    .then(data => res.status(200).send(data))
})

app.get('/entity', (req, res) => {
  knex('entity')
    .select('*')
    .then(data => res.status(200).send(data))
})

https.createServer(options, app).listen(port, () => {
  console.log('HTTPS server running on port 3001');
});

// app.listen(port, () => console.log(`listening on port: ${port}`))