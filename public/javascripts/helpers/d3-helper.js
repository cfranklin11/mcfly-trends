import $ from 'jquery'
import * as d3 from 'd3'

const d3Helper = {
  recalculatePercents () {
    const table = $('#table1')
    const tbody = table.children('tbody')
    const rows = tbody.children('tr:not(:first)')
    const rowCount = rows.length
    const weightsTable = []

    function monthSumFunc (j) {
      return (d) => {
        return d[j]
      }
    }

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

    // Calculate the mean search volume of each row's mean
    // to get the overall mean
    const sumTotal = d3.sum(weightsTable, (d, i) => {
      // Calculate search volume mean per row
      const termSumTotal = d3.sum(d, (e) => {
        return e
      })

      // Add the row's mean to the end of the data array
      // (i.e. the last column of the table)
      weightsTable[i].push(termSumTotal)

      return termSumTotal
    })

    weightsTable.push([])

    // Calculate mean of each month's search volume, then % difference
    // from overall mean
    for (let j = 0; j < weightsTable[0].length; j += 1) {
      // Calculate total mean per month across all years
      const monthSum = d3.sum(weightsTable, monthSumFunc(j))

      weightsTable[weightsTable.length - 1].push(monthSum)
    }

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

export default d3Helper
