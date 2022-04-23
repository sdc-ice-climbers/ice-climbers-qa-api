const pool = require('./db/db.js');
const query = require('./queries.js');

const getQuestions = (req, res) => {
  let count = req.query['count'] === undefined ? 5 : Number(req.query['count']);
  let page = req.query['page'] === undefined ? 1 : Number(req.query['page']);
  let product_id = req.query['product_id'] === undefined ? null : req.query['product_id'].toString();
  let QOffset = page === 1 ? 0 : count * page;

  pool.query(query.getQuestionsQuery, [product_id, count, QOffset])
  .then((results) => res.send(results.rows[0]))
  .catch((err) => {
    console.error(err);
    res.send(err)
  });
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
