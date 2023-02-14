// set up
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const shortid = require('shortid')
const port = 3000

// connect to mongodb database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Create mongoose schema for user
const Schema = mongoose.Schema;
var userSchema = new Schema({
  _id: { 'type': String,'default': shortid.generate },
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

// listen for requests
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})