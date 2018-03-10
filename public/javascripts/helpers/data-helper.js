import $ from 'jquery'

import Weights from '../collections/weights'
import Trends from '../collections/trends'
import appRouter from '../routers/router'

const dataHelper = {
  // Query callback to process the data object
  processData (response) {
    function keywordRow (i) {
      return (row) => {
        return {
          date: row.date,
          // If keyword value doesn't exist, sum values for total for the month
          value: row.value[i] ||
            row.value.reduce((accumulator, current) => {
              return accumulator + current
            }, 0),
        }
      }
    }

    function calculatePercent (total) {
      return (value) => {
        return ((value / total) * 100).toFixed(2).concat('%')
      }
    }

    const data = {
      headers: response.keyword,
      rows: response.data.map((monthData) => {
        return { date: monthData.formattedTime, value: monthData.value }
      }),
    }

    const colsLength = data.headers.length
    const totalWeight = data.rows.reduce((accumulator1, row) => {
      return accumulator1 + row.value.reduce((accumulator2, value) => {
        return accumulator2 + value
      }, 0)
    }, 0)
    const weights = new Weights()

    // Regexes for filtering data by month
    // (final one is for total weight for the given keyword)
    const monthRegexes = [/Jan/, /Feb/, /Mar/, /Apr/, /May/, /Jun/, /Jul/, /Aug/,
      /Sep/, /Oct/, /Nov/, /Dec/, /.*/]

    // Loop 1 more time than # of keywords to create a totals/overall average
    // row at bottom of table
    for (let i = 0; i < colsLength + 1; i += 1) {
      const termString = data.headers[i] || 'Monthly Weight'
      const termWeights = data.rows.map(keywordRow(i))

      // Map months to array of monthly weights
      const monthWeights = monthRegexes.map((monthRegex) => {
        // Filter by month name
        const monthlyWeights = termWeights.filter((weight) => {
          return monthRegex.test(weight.date)
        })
        // Get Sum of monthly weight values & divide by length for average weight per month for this keyword
        return monthlyWeights
          .map((monthlyWeight) => { return monthlyWeight.value })
          .reduce((accumulator, current) => {
            return accumulator + current
          }, 0)
      })

      const termWeight = monthWeights.pop()

      // Create weights collection, and populate it with weight models
      weights.add({
        term: termString,
        monthWeights,
        termWeight,
      })
    }

    weights.each((model) => {
      const modelAttr = model.attributes
      const modelWeights = modelAttr.monthWeights
      const monthPercents = modelWeights.map(calculatePercent(totalWeight))
      const termPercent = calculatePercent(totalWeight)(modelAttr.termWeight)

      model.set({
        monthPercents,
        termPercent,
      })
    })

    // Generate trends collection and populate it with trend models
    const monthConverter = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const rows = data.rows
    const rowsLength = rows.length
    const trendsArray = []

    for (let i = 0; i < rowsLength; i += 1) {
      const rowData = rows[i]
      const date = new Date(rowData.date)
      const trend = {
        year: date.getFullYear(),
        month: monthConverter[date.getMonth()],
      }

      // Create a new cell in table per data point in row,
      // leving off last column, which represents monthly total
      for (let j = 0; j < colsLength; j += 1) {
        trend[`volume${j}`] = rowData.value[j]
        // trend[`volume${j}`] = rowData[j]
      }

      trendsArray.push(trend)
    }

    const trends = new Trends()
    trends.reset(trendsArray)

    // Reveal data tables and auto-scroll down
    appRouter.createTables(weights, trends)
  },
  recalculatePercents () {
    const table = $('#table1')
    const tbody = table.children('tbody')
    const rows = tbody.children('tr:not(:first)')
    const rowCount = rows.length
    const weightsTable = []

    // Loop through each row
    for (let i = 0; i < rowCount - 1; i += 1) {
      weightsTable.push([])
      const row = $(rows[i])

      // Loop through each cell in the row, pushing 'included' months into
      // the data array
      for (let j = 0; j < 12; j += 1) {
        const cell = row.children(`[data-col="${j}"]`)

        if (cell.hasClass('included')) {
          weightsTable[i].push(Number(cell.attr('data-weight')))
        } else {
          weightsTable[i].push(0)
        }
      }
    }

    // Calculate the sum search volume of each row's sum
    // to get the overall sum
    const termSumTotals = weightsTable.map((currentRow) => {
      return currentRow.reduce((rowTotalSum, currentCell) => {
        return rowTotalSum + currentCell
      }, 0)
    }, 0)
    const sumTotal = termSumTotals.reduce((accumulatedSum, currentSum) => {
      return accumulatedSum + currentSum
    }, 0)

    for (let i = 0; i < termSumTotals.length; i += 1) {
      // Add the row's sum to the end of the data array
      // (i.e. the last column of the table)
      weightsTable[i].push(termSumTotals[i])
    }

    // Calculate sum of each month's search volume, then % difference
    // from overall sum
    const monthSums = weightsTable[0].map((month, idx) => {
      return weightsTable.reduce((accumulatedSum, currentRow) => {
        return accumulatedSum + currentRow[idx]
      }, 0)
    })

    weightsTable.push(monthSums)

    // Loop through 'included' cells of weights table and the weights array
    // to change text of table cells to reflect new weights
    for (let i = 0; i < weightsTable.length; i += 1) {
      const row = $(rows[i])
      const cells = row.children('td')

      for (let j = 0; j < weightsTable[i].length; j += 1) {
        const cell = cells[j]
        const value = ((weightsTable[i][j] / sumTotal) * 100).toFixed(2)
        $(cell).text(`${value}%`)
      }
    }
  },
}

export default dataHelper
