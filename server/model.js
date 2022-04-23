const pool = require('./db/db.js');

const query = `
SELECT
  p.product_id,
  json_agg(x.*) as results
FROM
  (
    SELECT
      q.question_id,
      q.question_body,
      q.question_date,
      q.asker_name,
      q.question_date,
      q.question_helpfulness,
      q.reported,
      json_object_agg(a.id,
        json_build_object(
          'id', a.id,
          'body', a.body,
          'date', a.date,
          'answerer_name', a.answerer_name,
          'helpfulness', a.helpfulness,
          'photos', (SELECT json_agg(pr.photo_url)
            FROM photos pr WHERE a.id = pr.answer_id
          )
        )
      ) AS answers
    FROM
      questions q JOIN products p USING (product_id)
      JOIN answers a USING (question_id)
      JOIN photos pr ON a.id = pr.answer_id
      WHERE product_id = $1
      GROUP BY (
        q.question_id,
        q.question_body,
        q.question_date,
        q.asker_name,
        q.question_date,
        q.question_helpfulness,
        q.reported
      )
    ) x,
    (SELECT * FROM products p WHERE product_id = $1) P
GROUP BY p.product_id
`;

const getQuestions = (req, res) => {
  let count = req.query['count'] === undefined ? 5 : req.query['count'];
  let page = req.query['page'] === undefined ? 1 : req.query['page'];
  let product_id = req.query['product_id'] === undefined ? null : req.query['product_id'].toString();

  pool.query(query, [product_id])
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
