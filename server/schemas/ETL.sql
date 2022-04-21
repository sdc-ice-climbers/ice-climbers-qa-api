-- Create Tables to import CSV files to
-- CREATE TABLE questionscsv (
--   question_id varchar,
--   product_id varchar,
--   question_body varchar(1000),
--   question_date bigINT,
--   asker_name varchar(60),
--   reported boolean,
--   question_helpfulness int,
--   email varchar(60)
-- );

-- CREATE TABLE answerscsv (
--   id bigint,
--   question_id varchar,
--   body varchar(1000),
--   date bigINT,
--   answerer_name varchar(60),
--   reported boolean,
--   helpfulness int,
--   email varchar(60)
-- );

-- CREATE TABLE photoscsv (
--   photo_id int,
--   answer_id bigint,
--   photo_URL varchar
-- );

-- Copy the csv contents to those tables
-- COPY questionscsv(
--   question_id,
--   product_id,
--   question_body,
--   question_date,
--   asker_name,
--   email,
--   reported,
--   question_helpfulness
-- )
-- FROM '/Users/owenyoshishige/Documents/Hack_Reactor_SEI/SDC/ice-climbers-qa-api/csvfiles/questions.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY answerscsv(
--   id,
--   question_id,
--   body,
--   date,
--   answerer_name,
--   email,
--   reported,
--   helpfulness
-- )
-- FROM '/Users/owenyoshishige/Documents/Hack_Reactor_SEI/SDC/ice-climbers-qa-api/csvfiles/answers.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY photoscsv(
--   photo_id,
--   answer_id,
--   photo_url
-- )
-- FROM '/Users/owenyoshishige/Documents/Hack_Reactor_SEI/SDC/ice-climbers-qa-api/csvfiles/answers_photos.csv'
-- DELIMITER ','
-- CSV HEADER;


-- Insert all of the csv table data into our real tables
INSERT INTO products (product_id)
SELECT
  i.product_id as product_id
FROM (SELECT DISTINCT product_id FROM questionscsv) i
ON CONFLICT DO NOTHING;

INSERT INTO questions (
  question_id,
  product_id,
  question_body,
  question_date,
  asker_name,
  reported,
  question_helpfulness,
  email
)
SELECT
  i.question_id as question_id,
  i.product_id as product_id,
  i.question_body as question_body,
  TO_TIMESTAMP(i.question_date / 1000) as question_date,
  i.asker_name as asker_name,
  i.reported as reported,
  i.question_helpfulness as question_helpfulness,
  i.email as email
FROM (SELECT
  question_id,
  product_id,
  question_body,
  question_date,
  asker_name,
  reported,
  question_helpfulness,
  email
  FROM questionscsv
) i
ON CONFLICT DO NOTHING;

INSERT INTO answers (
  question_id,
  id,
  body,
  date,
  answerer_name,
  reported,
  helpfulness,
  email
)
SELECT
  i.question_id as question_id,
  i.id as id,
  i.body as body,
  TO_TIMESTAMP(i.date / 1000) as date,
  i.answerer_name as answerer_name,
  i.reported as reported,
  i.helpfulness as helpfulness,
  i.email as email
FROM (SELECT
  question_id,
  id,
  body,
  date,
  answerer_name,
  reported,
  helpfulness,
  email
  FROM answerscsv
) i
ON CONFLICT DO NOTHING;

INSERT INTO photos (
  photo_id,
  answer_id,
  photo_url
)
SELECT
  i.photo_id as photo_id,
  i.answer_id as answer_id,
  i.photo_url as photo_url
FROM (SELECT * from photoscsv) i
ON CONFLICT DO NOTHING;

