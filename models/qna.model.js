const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionsAndAnswer = new Schema({
  username: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

const QnA = mongoose.model('QnA', questionsAndAnswer);

module.exports = QnA;