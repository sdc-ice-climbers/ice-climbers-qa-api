require('newrelic');
require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./routes');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});