/* eslint-disable no-console */

// Module dependencies.
const port = process.env.PORT || 8080
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')
const getData = require('./middleware/google-trends-data')
// const Bundler = require('parcel-bundler')

// Create server
const app = express()

// set up our express application
app.use(morgan('dev')) // log every request to the console
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride())

app.use('/dist', express.static(path.join(__dirname, './dist')))

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'))
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
