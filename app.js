// set up
const express = require('express')
const app = express()
const port = 3000

// serve static assets from the 'public' directory
app.use(express.static('public'))

// listen for requests
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})