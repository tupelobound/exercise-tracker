// set up
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3000

// connect to mongodb database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// serve static assets from the 'public' directory
app.use(express.static('public'))

// listen for requests
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})