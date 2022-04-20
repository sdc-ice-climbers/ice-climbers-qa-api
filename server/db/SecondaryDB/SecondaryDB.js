const mongoose = require('mongoose');

main().catch(err => console.error(err));

mongoose.connect('mongodb://localhost:1128/QnA');

const photos = mongoose.schema({
  photo_id: 'number',
  answer_id: 'number',
  URL: 'string'
});

const answers = mongoose.schema({
  id: 'number',
  body: 'string',
  date: 'string',
  answerer_name: 'string',
  helpfulness: 'number',
  photos: [photos]
});

const questions = mongoose.schema({
  question_id: 'number',
  question_body: 'string',
  question_date: 'string',
  asker_name: 'string',
  reported: 'boolean',
  answers: [answers]
});

const products = mongoose.schema({
  product_id: 'number',
  results: [questions]
});

const QnA = mongoose.model('QnA', products);
