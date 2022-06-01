const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.options('*', cors())
app.use(cookieParser())
app.use(express.json())

const uri = process.env.ATLAS_URI
mongoose.connect(uri, { useNewUrlParser: true })

// Connecting To Database
const connection = mongoose.connection
connection.once('open', () => {
  console.log('MongoDB Connected Successfully')
})

const corsOptions = {
  origin: [
    'http://localhost:8000',
    'https://akta-app-staging.herokuapp.com',
    'https://akta-app.herokuapp.com',
  ],
  credentials: true,
}
app.use(cors(corsOptions))
app.use('/users', require('./routes/users'))
app.use('/qna', require('./routes/qna'))

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})
