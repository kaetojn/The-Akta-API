const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    activeSurveys: {
      type: Array,
    },
    completedSurveys: {
      type: Array,
    },
    userType: {
      type: String,
      required: true,
    },
    hasCompletedProfile: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
)

const User = mongoose.model('User', userSchema)

module.exports = User
