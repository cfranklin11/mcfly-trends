/* eslint-disable no-console */

const googleTrends = require('google-trends-api')

// Make call to Google Trends
function getData (req, res, next) {
  const { keyword, geo, startMonth, endMonth } = req.body
  const startTime = startMonth === '' ? new Date(0) : new Date(startMonth)
  const endTime = endMonth === '' ? new Date() : new Date(endMonth)
  const params = { keyword, geo }

  googleTrends.interestOverTime(params)
    .then((response) => {
      const responseData = JSON.parse(response).default.timelineData
      // Have to filter by date after getting a response rather than using params,
      // because for shorter time periods, google-trends-api automatically returns
      // shorter time periods (e.g. weekly, daily) rather than monthly data
      const data = responseData
        .filter((responseRow) => {
          const formattedTime = new Date(responseRow.formattedTime)
          return formattedTime >= startTime && formattedTime <= endTime
        })
        .map((dataRow) => {
          const { formattedTime, value } = dataRow
          return { formattedTime, value }
        })
      const keywordData = typeof keyword === 'string' ? [keyword] : keyword

      req.trendsResponse = { data, keyword: keywordData }
      return next()
    })
    .catch((err) => {
      console.log(err)
      return res.status(500, 'There was an error in fetching the data.')
    })
}

module.exports = getData
