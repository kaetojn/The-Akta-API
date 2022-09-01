const router = require('express').Router()
let Profile = require('../models/profile.model')

router.route('/').get((req, res) => {
  Profile.find()
    .then((response) => res.json(response))
    .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/save').post((req, res) => {
  const {
    country,
    region,
    company,
    userID,
    industry,
    title,
    salary,
    education,
  } = req.body

  Profile.findOne({ userID }).then((response) => {
    if (!response) {
      // Save New Completed Profile
      const newProfile = new Profile({
        country,
        region,
        company,
        userID,
        industry,
        title,
        salary,
        education,
      })

      newProfile
        .save()
        .then(() => res.json('Response Saved!'))
        .catch((err) => res.status(400).json('Error: ' + err))
    } else {
      // Update a Previously Started Profile
      const filter = {
        'userID': userID,
      }
      const update = {
        $set: {
          'country': country,
          'region': region,
          'company': company,
          'industry': industry,
          'title': title,
          'salary': salary,
          'education': education,
        },
      }

      Profile.updateOne(filter, update)
        .then(() => res.json('Response Updated!'))
        .catch((err) => res.status(400).json('Error: ' + err))
    }
  })
})

router.route('/load').post((req, res) => {
  const { userID } = req.body

  Profile.findOne({ userID })
    .then((user) => {
      if (!user) return res.status(200).json('No Profile Yet')

      return res.status(200).json({
        country: user.country,
        region: user.region,
        company: user.company,
        industry: user.industry,
        title: user.title,
        salary: user.salary,
        education: user.education,
      })
    })
    .catch((e) => {
      console.log(e)
    })
})

router.route('/:id').get((req, res) => {
  Profile.findById(req.params.id)
    .then((response) => res.json(response))
    .catch((err) => res.status(400).json('Error: ' + err))
})

module.exports = router
