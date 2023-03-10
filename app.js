// set up
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const shortid = require('shortid')
const bodyParser = require('body-parser')
const moment = require('moment')
const port = 3000

// Mount the body parser
app.use(bodyParser.urlencoded({ extended: false }))

// connect to mongodb database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// Create mongoose schema for user
const Schema = mongoose.Schema
const userSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  username: String
})

// Create user model
const User = mongoose.model('User', userSchema)

// Create mongoose schema for workout
const workoutSchema = new Schema({
  userID: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now }
})

// Create workout model
const Workout = mongoose.model('Workout', workoutSchema)

// serve static assets from the 'public' directory
app.use(express.static('public'))

// Add new user from POST
app.post('/api/exercise/new-user', (req, res) => {
  // check if new user exists in the database
  User.find({ username: req.body.username }, (err, result) => {
    // if not, create and save a new user
    if (result.length === 0) {
      const newUser = new User({ username: req.body.username })
      newUser.save((err, result) => {
        res.json({ username: result.username, _id: result._id })
      })
      // if so, send the user a message
    } else {
      res.send('Sorry! Username already taken')
    }
  })
})

// Create endpoint for getting list of users in database
app.get('/api/exercise/users', (req, res) => {
  User.find({}, (err, result) => {
    res.send(result)
  })
})

// Add workout from POST
app.post('/api/exercise/add', (req, res) => {
  // Search for user in user database
  User.findById(req.body.userId, (err, result) => {
    if (result) {
      // Create and save new workout in workout database
      // Check if a date was supplied
      let newWorkout
      if (req.body.date) {
        newWorkout = new Workout({ userID: req.body.userId, description: req.body.description, duration: req.body.duration, date: req.body.date }) // if so, use it
      } else {
        newWorkout = new Workout({ userID: req.body.userId, description: req.body.description, duration: req.body.duration }) // if not, default is used
      }
      newWorkout.save((err, result) => {
        if (err) {
          res.send('Something went wrong, are you sure you included all the required information?') // send user error
        } else {
          res.json({ userID: result.userID, description: result.description, duration: result.duration, date: moment(result.date).format('YYYY-MM-DD') })
        }
      })
    } else {
      res.send("That user isn't present in the database")
    }
  })
})

// Create route for requesting log
app.get('/api/exercise/log', (req, res) => {
  if (req.query.UserId && req.query.from && req.query.to) {
    Workout.find({ userID: req.query.UserId, date: { $gt: req.query.from, $lt: req.query.to } }).select('-_id').limit(Number(req.query.limit)).exec((err, result) => {
      res.send('Log: ' + result + ' Exercise count: ' + result.length)
    })
  } else if (req.query.UserId && req.query.from) {
    Workout.find({ userID: req.query.UserId, date: { $gt: req.query.from, $lt: new Date() } }).limit(Number(req.query.limit)).exec((err, result) => {
      res.send('Log: ' + result + ' Exercise count: ' + result.length)
    })
  } else if (req.query.UserId && req.query.to) {
    Workout.find({ userID: req.query.UserId, date: { $gt: new Date('1970'), $lt: req.query.to } }).limit(Number(req.query.limit)).exec((err, result) => {
      res.send('Log: ' + result + ' Exercise count: ' + result.length)
    })
  } else if (req.query.UserId) {
    Workout.find({ userID: req.query.UserId }).limit(Number(req.query.limit)).exec((err, result) => {
      res.send('Log: ' + result + ' Exercise count: ' + result.length)
    })
  } else {
    res.send("Query url must include 'UserId='.")
  }
})

// listen for requests
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
