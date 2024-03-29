require('dotenv').config();
const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
//const knex = require('knex')(require('./knexfile.js').development)

const port = 3443;
const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    ca: [
      fs.readFileSync(process.env.SSL_CA_ROOT_PATH), 
//      fs.readFileSync(process.env.SSL_LETSENCRYPT_CA_PATH)
    ],
    //requestCert: true, 
    //rejectUnauthorized: true 
};

app.use(cors());
// app.use(express.json())
// app.use((req, res, next) => {
//   const cert = req.socket.getPeerCertificate();
//   if (cert && cert.subject && cert.subject.CN) {
//     const cn = cert.subject.CN;
//     const edipi = cn.split('.')[0]; 
//     if (edipi) {
//       console.log(`Authenticated user with EDIPI: ${edipi}`);
//       req.user = { edipi };
//       next();
//     } else {
//       res.status(401).send("Invalid EDIPI");
//       return;
//     }
//   } else {
//     res.status(401).send("No valid client certificate provided");
//     return;
//   }
// });
  
app.get('/', (req, res) => {
  res.send('Hello, HTTPS world!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});



https.createServer(options, app).listen(port, () => {
  console.log('HTTPS server running on port 3443');
});
