/* eslint-disable no-console */

const googleTrends = require('google-trends-api')

// Make call to Google Trends
function getData (req, res, next) {
  const keyword = req.body['keyword[]']
  const startTime = req.body.startTime === '' ? new Date(0) : new Date(req.body.startTime)
  const endTime = req.body.endTime === '' ? new Date() : new Date(req.body.endTime)
  const geo = req.body.geo
  const params = { keyword, geo }

  googleTrends.interestOverTime(params)
    .then((response) => {
      const responseData = JSON.parse(response).default.timelineData
      // Have to filter by date after getting a response rather than using params,
      // because for shorter time periods, google-trends-api automatically returns
      // shorter time periods (e.g. weekly, daily) rather than monthly data
      const timeFilteredData = responseData.filter((data) => {
        const formattedTime = new Date(data.formattedTime)
        return formattedTime >= startTime && formattedTime <= endTime
      })
      const keywordData = typeof keyword === 'string' ? [keyword] : keyword

      req.trendsResponse = { data: timeFilteredData, keyword: keywordData }
      return next()
    })
    .catch((err) => {
      console.log(err)
      return res.status(500, 'There was an error in fetching the data.')
    })
}

module.exports = getData
