const express = require('express');
const router = express.Router();
const model = require('./model');

router.get('/qa/questions/', model.getQuestions);

router.get('/qa/questions/:question_id/answers', model.getAnswers);

router.post('/qa/questions/', model.postQuestion);

router.post('/qa/answers/', model.postAnswer);

router.put('/qa/questions/:question_id/helpful', model.putHelpfulQ);

router.put('/qa/questions/:question_id/report', model.reportQuestion);

router.put('/qa/answers/:answer_id/helpful', model.putHelpfulA);

router.put('/qa/answers/:answer_id/report', model.putHelpfulQ);

module.exports = router;