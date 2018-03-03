/* eslint-disable no-console */

const googleTrends = require('google-trends-api')

// Make call to Google Trends
function getData (req, res, next) {
  req.keyword = req.body['keyword[]']
  console.log(req.keyword)
  const params = Object.assign(req.body, { keyword: req.keyword })
  const keywords = req.keyword

  googleTrends.interestOverTime(params)
    .then((response) => {
      const responseData = JSON.parse(response)
      req.trendsResponse = { data: responseData.default.timelineData, keywords }
      return next()
    })
    .catch((err) => {
      console.log(err)
      return res.status(500, 'There was an error in fetching the data.')
    })
}

module.exports = getData
