require('dotenv').config();
const pool = require('./db/db.js');
const query = require('./queries.js');

const getLoaderIOKey = (req, res) => {
  res.send(process.env.LOADERIO_KEY);
}

const getQuestions = (req, res) => {
  let count = req.query['count'] === undefined ? 5 : Number(req.query['count']);
  let page = req.query['page'] === undefined ? 1 : Number(req.query['page']);
  let product_id = req.query['product_id'] === undefined || req.query['product_id'].includes('/') ? null
  : req.query['product_id'].toString();
  let QOffset = page === 1 ? 0 : count * (page - 1);

  if (!product_id || Number.isNaN(Number(req.query['product_id']))) {
    res.sendStatus(422);
  } else {
    pool.query(query.getQuestionsQuery, [product_id, count, QOffset])
    .then((results) => res.send(results.rows[0]))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500)
    });
  }
};

const getAnswers = (req, res) => {
  let count = req.query['count'] === undefined ? 5 : Number(req.query['count']);
  let page = req.query['page'] === undefined ? 1 : Number(req.query['page']);
  let question_id = req.params['question_id'] === undefined ? null : req.params['question_id'];
  let AOffset = page === 1 ? 0 : count * (page - 1);

  if (!question_id) {
    res.sendStatus(422);
  } else {
    pool.query(query.getAnswersQuery, [question_id, page, count, AOffset])
    .then((results) => {
      if (Number.isNaN(Number(results.rows[0].question))) {
        res.sendStatus(422);
      } else {
        res.send(results.rows[0])
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
      return
    });
  }
};

const postQuestion = (req, res) => {
  let body = req.body;
  let standard = [
    Object.hasOwn(body, 'body'),
    Object.hasOwn(body, 'name'),
    Object.hasOwn(body, 'email'),
    Object.hasOwn(body, 'product_id')
  ];

  if (standard.includes(false)) {
    res.sendStatus(422)
  } else {
    pool.query(query.postQuestionQuery, [body.name, body.body, body.email, body.product_id])
    .then((results) => res.status(201).send(results.rows[0]))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
      return;
    })
  }
};

const validateObject = (obj) => {
  let standard = [
    Object.hasOwn(obj, 'body'),
    Object.hasOwn(obj, 'name'),
    Object.hasOwn(obj, 'email')
  ];

  return standard.includes(false) ? false : true;
}

const postAnswer = (req, res) => {
  let question_id = req.params.question_id;
  let body = req.body;
  let photos = req.body.photos === undefined || req.body.photos.length === 0 ? null : req.body.photos.length + 1;
  let isOutOfRange = req.body.length > 5 ? true : false;
  let isValidFormat = validateObject(body);

  if (isOutOfRange || !isValidFormat ||  Number.isNaN(Number(question_id))) {
    res.sendStatus(422);
  } else {
    pool.query(query.postAnswerQuery, [body.name, body.email, body.body, question_id])
    .then((results) => {
      if (!photos) {
        res.sendStatus(201);
      } else {
        const unnestElements = body.photos.map((element, index) => `$${index + 2}, `).join('');
        const dollarSigns = unnestElements.slice(0, unnestElements.length - 2);

        const postPhotoQuery = `
          INSERT INTO photos (answer_id, photo_url)
          SELECT
            $1, p.val
          FROM
            unnest(array[${dollarSigns}]) as p(val)
        `;

        pool.query(postPhotoQuery, [results.rows[0].id, ...body.photos])
        .then((result) => res.sendStatus(201))
        .catch((err) => {
          console.error(err);
          res.sendStatus(500);
          return
        })
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  }
};

const reportQuestion = (req, res) => {
  if (Number.isNaN(Number(req.params.question_id))) {
    res.sendStatus(422);
  } else {
    pool.query(query.reportQuestionQuery, [req.params.question_id])
    .then((results) => results.rowCount ? res.sendStatus(204) : res.status(422).send('Invalid question id'))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  }
};

const reportAnswer = (req, res) => {
  if (Number.isNaN(Number(req.params.answer_id))) {
    res.sendStatus(422);
  } else {
    pool.query(query.reportAnswerQuery, [req.params.answer_id])
    .then((results) => res.sendStatus(204))
    .catch((err) => {
      console.error(err);
      if (err.code === '22003') {
        res.status(422).send('Invalid answer id')
      } else {
        res.sendStatus(500)
      }
    })
  }
};

const putHelpfulQ = (req, res) => {
  if (Number.isNaN(Number(req.params.question_id))) {
    res.sendStatus(422);
  } else {
    pool.query(query.questionHelpfulnessQuery, [req.params.question_id])
    .then((results) => results.rowCount ? res.sendStatus(204) : res.status(422).send('Invalid question id'))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  }
};

const putHelpfulA = (req, res) => {
  if (Number.isNaN(Number(req.params.answer_id))) {
    res.sendStatus(422);
  } else {
    pool.query(query.answerHelpfulnessQuery, [req.params.answer_id])
    .then((results) => results.rowCount ? res.sendStatus(204) : res.status(422).send('Invalid answer id'))
    .catch((err) => {
      console.error(err);
      if (err.code === '22003') {
        res.status(422).send('Invalid answer id')
      } else {
        res.sendStatus(500)
      }
    });
  }
};

module.exports = {
  getLoaderIOKey,
  getQuestions,
  getAnswers,
  postQuestion,
  postAnswer,
  reportQuestion,
  reportAnswer,
  putHelpfulQ,
  putHelpfulA
};
