// const getQuestionsQuery = `
// SELECT
//   $1 AS product_id,
//   coalesce(json_agg(x.*), '[]'::json) as results
// FROM (
//   SELECT
//     q.question_id,
//     q.question_body,
//     q.question_date,
//     q.asker_name,
//     q.question_date,
//     q.question_helpfulness,
//     q.reported,
//     coalesce(json_object_agg(a.id,
//       json_build_object(
//         'id', a.id,
//         'body', a.body,
//         'date', a.date,
//         'answerer_name', a.answerer_name,
//         'helpfulness', a.helpfulness,
//         'photos', (SELECT coalesce(json_agg(pr.photo_url), '[]'::json)
//           FROM photos pr WHERE a.id = pr.answer_id
//         )
//       )
//     ), '{}'::json) AS answers
//   FROM
//     questions q JOIN products p USING (product_id)
//     JOIN answers a USING (question_id)
//     JOIN photos pr ON a.id = pr.answer_id
//     WHERE product_id = '10000'
//     GROUP BY (
//       q.question_id,
//       q.question_body,
//       q.question_date,
//       q.asker_name,
//       q.question_date,
//       q.question_helpfulness,
//       q.reported
//     )
//     LIMIT $2
//     OFFSET $3
//   ) x
// `;

// const getQuestionsQuery = `
// SELECT
//   $1 AS product_id,
//   coalesce(json_agg(x.*), '[]'::json) as results
// FROM (
//   SELECT
//     q.question_id,
//     q.question_body,
//     q.question_date,
//     q.asker_name,
//     q.question_date,
//     q.question_helpfulness,
//     q.reported,
//     coalesce(json_object_agg(q.id,
//       coalesce(json_build_object(
//         'id', q.id,
//         'body', q.body,
//         'date', q.date,
//         'answerer_name', q.answerer_name,
//         'helpfulness', q.helpfulness,
//         'photos', (SELECT coalesce(json_agg(pr.photo_url), '[]'::json)
//           FROM photos pr WHERE q.id = pr.answer_id
//         ), '[12,12]'::json)
//       )
//     ), '{}'::json) AS answers
//   FROM
//     (SELECT DISTINCT
//       q.*,
//       a.id,
//       a.body,
//       a.date,
//       a.answerer_name,
//       a.helpfulness
//       FROM products p JOIN questions q  USING (product_id) FULL OUTER JOIN answers a USING (question_id) WHERE p.product_id = $1 AND q.reported = false) AS q
//     GROUP BY (
//       q.question_id,
//       q.question_body,
//       q.question_date,
//       q.asker_name,
//       q.question_date,
//       q.question_helpfulness,
//       q.reported
//     )
//     LIMIT $2
//     OFFSET $3
//   ) x
// `;


const getQuestionsQuery = `
SELECT
  $1 AS product_id,
  $2 AS poop,
  $3 AS poop2,
  coalesce(json_agg(x.*), '[]'::json) as results
FROM (
  SELECT
    q.question_id,
    q.question_body,
    q.question_date,
    q.asker_name,
    q.question_date,
    q.question_helpfulness,
    q.reported,
    coalesce(json_object_agg(q.id,
      json_build_object(
        'id', q.id,
        'body', q.body,
        'date', q.date,
        'answerer_name', q.answerer_name,
        'helpfulness', q.helpfulness
      )
    ) FILTER (WHERE q.id IS NOT NULL AND q.reportedA = false), '{}'::json) as answers
  FROM
      (
      SELECT
      q.question_id,
      q.question_body,
      q.question_date AS question_dates,
      q.asker_name,
      q.question_date,
      q.question_helpfulness,
      q.reported,
      a.id,
      a.body,
      a.date,
      a.reported as reportedA,
      a.answerer_name,
      a.helpfulness
      FROM
      questions q LEFT JOIN products p USING (product_id)
      LEFT JOIN answers a USING (question_id)
      WHERE q.product_id = $1 AND q.reported = false
      ) as q
  GROUP BY (
    q.question_id,
    q.question_body,
    q.question_date,
    q.asker_name,
    q.question_date,
    q.question_helpfulness,
    q.reported
  )
) as x
`;


const getAnswersQuery = `
SELECT
  $1 as question,
  $2::integer as page,
  $3 as count,
  coalesce(json_agg(x.*), '[]'::json) as results
FROM (
  SELECT
    a.id as answer_id,
    a.body,
    a.date,
    a.answerer_name,
    a.helpfulness,
    coalesce(json_agg(
      json_build_object(
        'id',  p.photo_id,
        'url', p.photo_url
      )
    ), '[]'::json) AS photos
  FROM
    answers a JOIN photos p ON a.id = p.answer_id
    WHERE a.question_id = $1
  GROUP BY (
    a.id,
    a.body,
    a.date,
    a.answerer_name,
    a.helpfulness
  )
  LIMIT $3
  OFFSET $4
) x
`;

const postQuestionQuery = `
INSERT INTO questions (
  asker_name,
  question_body,
  email,
  product_id,
  reported,
  question_helpfulness,
  question_date
  )
VALUES ($1, $2, $3, $4, 'f', 0, current_timestamp)
RETURNING product_id
`;

const postAnswerQuery = `
INSERT INTO answers (
  answerer_name,
  email,
  body,
  question_id,
  reported,
  helpfulness,
  date
  )
VALUES ($1, $2, $3, $4, 'f', 0, current_timestamp)
RETURNING id
`;

const reportQuestionQuery = `
UPDATE questions
SET reported = 't'
WHERE question_id = $1
`;

const reportAnswerQuery = `
UPDATE answers
SET reported = true
WHERE id = $1
RETURNING reported
`;

const questionHelpfulnessQuery = `
UPDATE questions
SET question_helpfulness = question_helpfulness + 1
WHERE question_id = $1
`;

const answerHelpfulnessQuery = `
UPDATE answers
SET helpfulness = helpfulness + 1
WHERE id = $1
`;

module.exports = {
  getQuestionsQuery,
  getAnswersQuery,
  postQuestionQuery,
  postAnswerQuery,
  reportQuestionQuery,
  reportAnswerQuery,
  questionHelpfulnessQuery,
  answerHelpfulnessQuery,
};
