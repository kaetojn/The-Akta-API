const mongoose = require('mongoose')

const Schema = mongoose.Schema

const surveyResponses = new Schema(
  {
    surveyID: { type: String, required: true },
    userID: { type: String, required: true },
    questionsAndAnswers: { type: Array, required: true },
    isComplete: { type: Boolean, required: true },
    index: { type: Number },
  },
  {
    timestamps: true,
  },
)

const Responses = mongoose.model('Responses', surveyResponses)

module.exports = Responses
