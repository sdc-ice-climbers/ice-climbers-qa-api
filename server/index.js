const express = require('express');
const app = express();
const router = require('./routes')
const port = 1128;

//JSON middleware();
app.use(express.json());

//route requests to routes.js file
app.use(router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});