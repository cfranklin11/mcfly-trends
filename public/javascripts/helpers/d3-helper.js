/* eslint-disable */

'use strict';

var bbApp = bbApp || {};

(function(d3, $) {

  bbApp.d3Helper = {
    recalculatePercents: function() {
      var table = $('#table1'),
        tbody = table.children('tbody'),
        rows = tbody.children('tr:not(:first)'),
        rowCount = rows.length,
        weightsTable = [],
        i, j, row, cell, sumTotal, termSumTotal, monthSum, cells, value;

      // Loop through each row
      for (i = 0; i < rowCount - 1; i++) {
        weightsTable.push([]);
        row = $(rows[i]);

        // Loop through each cell in the row, pushing 'included' months into
        // the data array
        for (j = 0; j < 12; j++) {
          cell = row.children('[data-col="' + j + '"]');

          if (cell.hasClass('included')) {
            weightsTable[i].push(Number(cell.attr('data-weight')));
          } else {
            weightsTable[i].push(0);
          }
        }
      }

      // Calculate the mean search volume of each row's mean
      // to get the overall mean
      sumTotal = d3.sum(weightsTable, function (d, i) {

        // Calculate search volume mean per row
        termSumTotal = d3.sum(d, function (e) {
          return e;
        });

        // Add the row's mean to the end of the data array
        // (i.e. the last column of the table)
        weightsTable[i].push(termSumTotal);
        return termSumTotal;
      });

      weightsTable.push([]);

      // Calculate mean of each month's search volume, then % difference
      // from overall mean
      for (j = 0; j < weightsTable[0].length; j++) {

        // Calculate total mean per month across all years
        monthSum = d3.sum(weightsTable, monthSumFunc);

        weightsTable[weightsTable.length - 1].push(monthSum);
      }

      // Loop through 'included' cells of weights table and the weights array
      // to change text of table cells to reflect new weights
      for (i = 0; i < weightsTable.length; i++) {
        row = $(rows[i]);
        cells = row.children('td');

        for (j = 0; j < weightsTable[i].length; j++) {
          cell = cells[j];
          value = ((weightsTable[i][j] / sumTotal) * 100).toFixed(2);
          $(cell).text(value + '%');
        }
      }

      function monthSumFunc(d) {
        return d[j];
      }
    }
  };
})(d3, jQuery);
