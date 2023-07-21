const express = require('express');
const cors = require('cors');
const knex = require('knex')(require('./knexfile.js').development)
const port = 8080;
const app = express();

app.use(cors());
app.use(express.json())



app.listen(port, () => console.log(`Server running on port: ${port}`));