
CREATE TABLE products (
  id int,
  product_id varchar(5) primary key
);

CREATE TABLE questions (
  question_id varchar(6) primary key,
  product_id varchar(5) references products(product_id),
  question_body varchar(1000),
  question_date timestamp,
  asker_name varchar(60),
  reported boolean,
  question_helpfulness int,
  email varchar(60)
);

CREATE TABLE answers (
  id int primary key,
  question_id varchar(6) references questions(question_id),
  body varchar(1000),
  date timestamp,
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


/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/
