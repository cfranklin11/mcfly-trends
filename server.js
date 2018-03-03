/* eslint-disable no-console */

// Module dependencies.
const port = process.env.PORT || 8080
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')
const getData = require('./middleware/google-trends-data')

// Create server
const app = express()

// set up our express application
app.use(morgan('dev')) // log every request to the console
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())

// Set client-side directory
app.use(express.static(path.join(__dirname, '/public')))

// Routes
app.get('/', (req, res) => {
  res.render('index')
})

app.post(
  '/data',
  getData,
  (req, res) => {
    res.json(req.trendsResponse)
  },
)

// launch ======================================================================
app.listen(port)
console.log(`The magic happens on port ${port}`)
