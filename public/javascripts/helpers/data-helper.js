/* eslint-disable strict, prefer-const, no-use-before-define, no-var, one-var, one-var-declaration-per-line */

'use strict';

var bbApp = bbApp || {};

(function createDataHelper () {
  bbApp.dataHelper = {
    // Query callback to process the data object
    processData (response) {
      var data, weights, i, termWeight, modelAttr, modelWeights,
        monthPercents, termPercent, j, monthConverter, rows, rowsLength,
        trendsArray, trend, rowData, date, year;

      data = {
        headers: response.keyword,
        rows: response.data.map((monthData) => {
          return { date: monthData.formattedTime, value: monthData.value }
        }),
      }

      const colsLength = data.headers.length;
      const totalWeight = data.rows.reduce((accumulator1, row) => {
        return accumulator1 + row.value.reduce((accumulator2, value) => {
          return accumulator2 + value
        }, 0)
      }, 0);
      weights = bbApp.weights;

      weights.reset();

      // Regexes for filtering data by month
      // (final one is for total weight for the given keyword)
      const monthRegexes = [/Jan/, /Feb/, /Mar/, /Apr/, /May/, /Jun/, /Jul/, /Aug/,
        /Sep/, /Oct/, /Nov/, /Dec/, /.*/]

      // Loop 1 more time than # of keywords to create a totals/overall average
      // row at bottom of table
      for (i = 0; i < colsLength + 1; i += 1) {
        const termString = data.headers[i] || 'Monthly Weight';
        const termWeights = data.rows.map(keywordRow)

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

        termWeight = monthWeights.pop();

        // Create weights collection, and populate it with weight models
        weights.add({
          term: termString,
          monthWeights,
          termWeight,
        });
      }

      weights.each((model) => {
        modelAttr = model.attributes;
        modelWeights = modelAttr.monthWeights;
        monthPercents = modelWeights.map(calculatePercent);
        termPercent = calculatePercent(modelAttr.termWeight);

        model.set({
          monthPercents,
          termPercent,
        });
      });

      // Generate trends collection and populate it with trend models
      monthConverter = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
      rows = data.rows;
      rowsLength = rows.length;
      trendsArray = [];

      for (i = 0; i < rowsLength; i += 1) {
        trend = {};
        rowData = rows[i];
        date = new Date(rowData.date);
        year = date.getFullYear();
        trend.year = year;
        const monthIndex = date.getMonth();
        trend.month = monthConverter[monthIndex]

        // Create a new cell in table per data point in row,
        // leving off last column, which represents monthly total
        for (j = 0; j < colsLength; j += 1) {
          trend[`volume${j}`] = rowData.value[j];
          // trend[`volume${j}`] = rowData[j];
        }

        trendsArray.push(trend);
      }

      bbApp.trends.reset(trendsArray);

      // Reveal data tables and auto-scroll down
      bbApp.appRouter.createTables();

      function keywordRow (row) {
        return {
          date: row.date,
          // If keyword value doesn't exist, sum values for total for the month
          value: row.value[i] ||
            row.value.reduce((accumulator, current) => {
              return accumulator + current
            }, 0),
        }
      }

      function calculatePercent (value) {
        return ((value / totalWeight) * 100).toFixed(2).concat('%');
      }
    },
  };
}());
