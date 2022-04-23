const getQuestionsQuery = `
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
          'photos', (SELECT coalesce(json_agg(pr.photo_url), '[]'::json)
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
      LIMIT $2
      OFFSET $3
    ) x,
    (SELECT * FROM products p WHERE product_id = $1) P
GROUP BY p.product_id
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
    json_agg(
      json_build_object(
        'id',  p.photo_id,
        'url', p.photo_url
      )
    ) AS photos
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
) x
`;

module.exports = {
  getQuestionsQuery,
  getAnswersQuery
}