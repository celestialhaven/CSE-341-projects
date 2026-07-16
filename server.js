const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();

const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'Origin, X-Requested-With, Content-Type, Accept, Z-key');
  res.setHeader('Access-Control-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
app.use(express.json());


app.use('/', require('./routes'));


mongodb.initDB((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  } else {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
});