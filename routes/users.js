const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

let User = require('../models/user.model')
require('dotenv').config()

router.route('/').get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json('Error: ' + err))
})

// FORGOTTEN PASSWORD
router.route('/reset-password').post((req, res) => {
  const { email } = req.body

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ msg: 'No User Found' })
    } else {
      const token = crypto.randomBytes(20).toString('hex')

      user.update({
        resetPasswordToken: token,
        restPassowordExpires: Date.now() + 3600000,
      })

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.PASSOWRD}`,
        },
      })

      const mailOptions = {
        from: 'Akta Surveys',
        to: `${user.email}`,
        subject: 'Link to Reset Password',
        text:
          `You are receiving this becausey you (or someone else) have requested the rest of your password for this account\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process within one hour of recieving it: \n\n` +
          `http://localhost:8000/reset/${token}\n\n` +
          `If you did not request this please ignor this email and your password will remain unchanged.\n`,
      }

      console.log('sending mail')

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error('Error', err)
        } else {
          console.log('Response', response)
          res.status(200).json('Recovery Email Sent')
        }
      })
    }
  })
})

// REGISTER A NEW USER
router.route('/register').post((req, res) => {
  const { firstName, lastName, email, password, userType } = req.body

  User.findOne({ email: email }).then((user) => {
    if (user) return res.status(400).json({ msg: 'User already exists' })

    const newUser = new User({ firstName, lastName, email, password, userType })

    //Password hashing
    bcrypt.genSalt(12, (err, salt) =>
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err
        newUser.password = hash

        // Save user
        newUser
          .save()
          .then(res.json('Successfully Registered'))
          .catch((err) => console.log(err))
      }),
    )
  })
})

// UPDATE USERS ACTIVE AND COMPLETED SURVEYS
router.route('/update-surveys').post((req, res) => {
  const { activeSurveys, completedSurveys, email } = req.body

  const filter = {
    'email': email,
  }
  const update = {
    $set: {
      'activeSurveys': activeSurveys,
      'completedSurveys': completedSurveys,
    },
  }

  User.updateOne(filter, update)
    .then(() => res.json('User Survey Updated!'))
    .catch((err) => res.status(400).json('Error: ' + err))
})

// SIGN IN A USER
router.route('/login').post((req, res) => {
  const { email, password } = req.body

  User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(400).json('Incorrect Email or Password')

      // Validate password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) return res.status(400).json('Incorrect Email or Password')

        const token = jwt.sign(
          { email: user.email, userId: user._id },
          'secret_this_should_be_longer',
          { expiresIn: '1h' },
        )

        return res.status(200).json({
          token: token,
          userId: user._id,
          user: user,
          activeSurveys: user.activeSurveys,
          completedSurveys: user.completedSurveys,
          userType: user.userType,
        })
      })
    })
    .catch((e) => {
      console.log(e)
    })
})

module.exports = router
