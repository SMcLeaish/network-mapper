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