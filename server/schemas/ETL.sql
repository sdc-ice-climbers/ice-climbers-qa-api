--NOTE: You will have to go into the csv files and edit the
--table names to match the csv temp tables being created below
--The column names can be changed by changing the first line of the csv files.

-- Create Tables to import CSV files to
CREATE TABLE questionscsv (
  question_id varchar,
  product_id varchar,
  question_body varchar(1000),
  question_date bigINT,
  asker_name varchar(60),
  reported boolean,
  question_helpfulness int,
  email varchar(60)
);

CREATE TABLE answerscsv (
  id bigint,
  question_id varchar,
  body varchar(1000),
  date bigINT,
  answerer_name varchar(60),
  reported boolean,
  helpfulness int,
  email varchar(60)
);

CREATE TABLE photoscsv (
  photo_id int,
  answer_id bigint,
  photo_URL varchar
);

--End of csv tables. Once you have copied the above table names to the CSV
--files, you are ready to do the ETL transfer.

-- Copy all CSV Data into the temp tables
Copy the csv contents to those tables
COPY questionscsv(
  question_id,
  product_id,
  question_body,
  question_date,
  asker_name,
  email,
  reported,
  question_helpfulness
)
FROM '/Users/owenyoshishige/Documents/Hack_Reactor_SEI/SDC/ice-climbers-qa-api/csvfiles/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answerscsv(
  id,
  question_id,
  body,
  date,
  answerer_name,
  email,
  reported,
  helpfulness
)
FROM '/Users/owenyoshishige/Documents/Hack_Reactor_SEI/SDC/ice-climbers-qa-api/csvfiles/answers.csv'
DELIMITER ','
CSV HEADER;

COPY photoscsv(
  photo_id,
  answer_id,
  photo_url
)
FROM '/Users/owenyoshishige/Documents/Hack_Reactor_SEI/SDC/ice-climbers-qa-api/csvfiles/answers_photos.csv'
DELIMITER ','
CSV HEADER;


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


--Add Auto Increment to main tables
CREATE SEQUENCE question_id_sq;
ALTER TABLE questions
ALTER COLUMN question_id SET DEFAULT nextval('question_id_sq');
SELECT setval('question_id_sq', (SELECT MAX(question_id::integer) FROM questions) + 1);

CREATE SEQUENCE answer_id_sq;
ALTER TABLE answers
ALTER COLUMN id SET DEFAULT nextval('answer_id_sq');
SELECT setval('answer_id_sq', (SELECT MAX(id::integer) FROM answers) + 1);

CREATE SEQUENCE photo_id_sq;
ALTER TABLE photos
ALTER COLUMN photo_id SET DEFAULT nextval('photo_id_sq');
SELECT setval('photo_id_sq', (SELECT MAX(photo_id) FROM photos) + 1);


--Drop temp tables
DROP TABLE IF EXISTS questionscsv;
DROP TABLE IF EXISTS answerscsv;
DROP TABLE IF EXISTS photoscsv;