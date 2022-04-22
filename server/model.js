const pool = require('./db/db.js');

const getQuestions = (req, res) => {
  let count = req.query['count'] === undefined ? 5 : req.query['count'];
  let page = req.query['page'] === undefined ? 1 : req.query['page'];
  let product_id = req.query['product_id'] === undefined ? null : req.query['product_id'].toString();

  pool.query('SELECT * FROM answers WHERE id=1')
  .then((results) => {
    res.send('poop')
    pool.end()
  })
  .catch((err) => {
    console.error(err)
    pool.end()
  })

  //   res.sendStatus(422);
  // } else {
  //   res.send(pool);
  // }
  // console.log('poops')
  res.send('oops')
};

const getAnswers = (req, res) => {
  //
};

const postQuestion = (req, res) => {
  //
};

const postAnswer = (req, res) => {
  //
};

const reportQuestion = (req, res) => {
  //
};

const reportAnswer = (req, res) => {
  //
}

const putHelpfulQ = (req, res) => {
  //
};

const putHelpfulA = (req, res) => {
  //
};

module.exports = {
  getQuestions,
  getAnswers,
  postQuestion,
  postAnswer,
  reportQuestion,
  reportAnswer,
  putHelpfulQ,
  putHelpfulA
};
