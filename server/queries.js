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


module.exports = {
  getQuestionsQuery
}