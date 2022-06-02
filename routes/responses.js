const router = require('express').Router()
let Responses = require('../models/responses.model')

router.route('/').get((req, res) => {
  Responses.find()
    .then((response) => res.json(response))
    .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/save').post((req, res) => {
  const { index, isComplete, questionsAndAnswers, userID, surveyID } = req.body

  Responses.findOne({ surveyID, userID }).then((response) => {
    if (!response) {
      // Save New Completed Response
      const newSurveyResponse = new Responses({
        surveyID,
        userID,
        questionsAndAnswers,
        isComplete,
        index,
      })

      newSurveyResponse
        .save()
        .then(() => res.json('Response Saved!'))
        .catch((err) => res.status(400).json('Error: ' + err))
    } else {
      // Update a Previously Started Response
      const filter = {
        'surveyID': surveyID,
        'userID': userID,
      }
      const update = {
        $set: {
          'questionsAndAnswers': questionsAndAnswers,
          'isComplete': isComplete,
          'index': index,
        },
      }

      Responses.updateOne(filter, update)
        .then(() => res.json('Response Updated!'))
        .catch((err) => res.status(400).json('Error: ' + err))
    }
  })
})

router.route('/progress').post((req, res) => {
  const { surveyID, userID } = req.body

  Responses.findOne({ surveyID, userID })
    .then((response) => {
      if (response) {
        return res.status(200).json({
          questionsAndAnswers: response.questionsAndAnswers,
          index: response.index,
        })
      } else {
        console.log('Response Progress Not Found')
      }
    })
    .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/:id').get((req, res) => {
  Responses.findById(req.params.id)
    .then((response) => res.json(response))
    .catch((err) => res.status(400).json('Error: ' + err))
})

module.exports = router
