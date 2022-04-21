
CREATE TABLE products (
  product_id varchar primary key
);

CREATE TABLE questions (
  question_id varchar primary key,
  product_id varchar references products(product_id),
  question_body varchar(1000),
  question_date timestamp,
  asker_name varchar(60),
  reported boolean,
  question_helpfulness int,
  email varchar(60)
);

CREATE TABLE answers (
  id int primary key,
  question_id varchar references questions(question_id),
  body varchar(1000),
  date bigINT,
  answerer_name varchar(60),
  reported boolean,
  helpfulness int,
  email varchar(60)
);

CREATE TABLE photos (
  photo_id int,
  answer_id int references answers(id),
  photo_URL varchar
);


