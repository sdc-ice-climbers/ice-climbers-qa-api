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


-- Last step is to insert all of the csv table data into our real tables
INSERT INTO products (
  product_id
)

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

INSERT INTO photos (
  photo_id,
  answer_id,
  photo_url
);
