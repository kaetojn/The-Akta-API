const router = require('express').Router()
let Responses = require('../models/responses.model')

router.route('/').get((req, res) => {
  Responses.find()
    .then((response) => res.json(response))
    .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/save').post((req, res) => {
  const surveyID = req.body.surveyID
  const userID = req.body.userID
  const questionsAndAnswers = req.body.questionsAndAnswers
  const isComplete = req.body.isComplete

  const newSurveyResponse = new Responses({
    surveyID,
    userID,
    questionsAndAnswers,
    isComplete,
  })

  newSurveyResponse
    .save()
    .then(() => res.json('Response Saved!'))
    .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/update').put((req, res) => {
  const surveyID = req.body.surveyID
  const userID = req.body.userID
  const questionsAndAnswers = req.body.questionsAndAnswers
  const isComplete = req.body.isComplete

  const filter = {
    'surveyID': surveyID,
    'userID': userID,
  }
  const update = {
    $set: {
      'questionsAndAnswers': questionsAndAnswers,
      'isComplete': isComplete,
    },
  }

  Responses.updateOne(filter, update)
    .then((response) => res.json(response))
    .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/:id').get((req, res) => {
  Responses.findById(req.params.id)
    .then((response) => res.json(response))
    .catch((err) => res.status(400).json('Error: ' + err))
})

module.exports = router
