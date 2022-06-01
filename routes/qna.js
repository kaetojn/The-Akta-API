const router = require('express').Router();
let QnA = require('../models/qna.model');

router.route('/').get((req, res) => {
  QnA.find()
    .then(qna => res.json(qna))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/answer').post((req, res) => {
  const username = req.body.username;
  const question = req.body.question;
  const answer = req.body.answer;
  const date = Date.parse(req.body.date);

  const newQnA = new QnA({
    username,
    question,
    answer,
    date
  });

  newQnA.save()
  .then(() => res.json('Question Answered!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  QnA.findById(req.params.id)
    .then(qna => res.json(qna))
    .catch(err => res.status(400).json('Error: ' + err));
}); 

module.exports = router;