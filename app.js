// set up
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const shortid = require('shortid')
const bodyParser = require('body-parser')
const port = 3000

// Mount the body parser
app.use(bodyParser.urlencoded({ extended: false }))

// connect to mongodb database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Create mongoose schema for user
const Schema = mongoose.Schema;
var userSchema = new Schema({
  _id: { 'type': String, 'default': shortid.generate },
  username: String
});

// Create user model
var User = mongoose.model('User', userSchema);

// Create mongoose schema for workout
var workoutSchema = new Schema({
  userID: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// Create workout model
var Workout = mongoose.model('Workout', workoutSchema);

// serve static assets from the 'public' directory
app.use(express.static('public'))

// Add new user from POST
app.post('/api/exercise/new-user', (req, res) => {

  // check if new user exists in the database
  User.find({ username: req.body.username }, (err, result) => {
    // if not, create and save a new user
    if (result.length === 0) {
      var newUser = new User({ username: req.body.username });
      newUser.save((err, result) => {
        res.json({ username: result.username, _id: result._id })
      });
      // if so, send the user a message  
    } else {
      res.send('Sorry! Username already taken');
    }
  });
});

// Create endpoint for getting list of users in database
app.get('/api/exercise/users', (req, res) => {
  User.find({}, (err, result) => {
    res.send(result);
  })
});

// listen for requests
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})