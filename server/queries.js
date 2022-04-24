const getQuestionsQuery = `
SELECT
  '10000' AS product_id,
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
    coalesce(json_object_agg(a.id,
      json_build_object(
        'id', a.id,
        'body', a.body,
        'date', a.date,
        'answerer_name', a.answerer_name,
        'helpfulness', a.helpfulness,
        'photos', (SELECT coalesce(json_agg(pr.photo_url), '[]'::json)
          FROM photos pr WHERE a.id = pr.answer_id
        )
      )
    ), '{}'::json) AS answers
  FROM
    questions q JOIN products p USING (product_id)
    JOIN answers a USING (question_id)
    JOIN photos pr ON a.id = pr.answer_id
    WHERE product_id = '10000'
    GROUP BY (
      q.question_id,
      q.question_body,
      q.question_date,
      q.asker_name,
      q.question_date,
      q.question_helpfulness,
      q.reported
    )
  ) x
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
SET reported = 't'
WHERE id = $1
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
