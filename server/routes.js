const express = require('express');
const router = express.Router();

router.get('/qa/questions/', (req, res) => {
  let count = req.query['count'] === undefined ? 5 : req.query['count'];
  let page = req.query['page'] === undefined ? 1 : req.query['page'];
  let product_id = req.query['product_id'] === undefined ? null : req.query['product_id'];

  let results = {
    count: count,
    page: page,
    product_id: product_id
  };

  if (!product_id) {
    res.sendStatus(422);
  } else {
    res.send(results);
  }
});

module.exports = router;