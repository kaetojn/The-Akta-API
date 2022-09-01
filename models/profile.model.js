const mongoose = require('mongoose')

const Schema = mongoose.Schema

const profileSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
    },
    region: {
      type: String,
    },
    company: {
      type: String,
    },
    industry: {
      type: String,
    },
    title: {
      type: String,
    },
    salary: {
      type: String,
    },
    education: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile
