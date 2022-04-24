
CREATE TABLE products (
  product_id varchar primary key
);

CREATE TABLE questions (
  question_id varchar primary key,
  product_id varchar references products(product_id),
  question_body varchar(1000) not null,
  question_date timestamp not null,
  asker_name varchar(60) not null,
  reported boolean not null,
  question_helpfulness int not null,
  email varchar(60) not null
);

CREATE TABLE answers (
  id int primary key,
  question_id varchar references questions(question_id),
  body varchar(1000) not null,
  date timestamp not null,
  answerer_name varchar(60) not null,
  reported boolean not null,
  helpfulness int not null,
  email varchar(60) not null
);

CREATE TABLE photos (
  photo_id int NOT NULL,
  answer_id int references answers(id),
  photo_URL varchar NOT NULL
);


