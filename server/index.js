require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./routes')

//JSON middleware();
app.use(express.json());

//route requests to routes.js file
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});