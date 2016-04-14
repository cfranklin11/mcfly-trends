'use strict';

var bbApp = bbApp || {};

(function(google) {

  bbApp.GoogleHelper = {

    // Make call to Google Trends
    getData: function(params) {
      var callParams, callUrl, query;

      callParams = '?' + params + '&cid=TIMESERIES_GRAPH_0&export=3';
      callUrl = 'https://www.google.com/trends/fetchComponent' + callParams;

      query = new google.visualization.Query(callUrl);
      query.send(bbApp.GoogleHelper.processData);
    },
    // Query callback to process the data object
    processData: function(response) {
      var d3Helper, data, colsLength, totalWeight, weights, i, termString,
        weightsArray, termWeight, model, modelAttr, modelWeights,
        modelPercents, termPercent, j, monthConverter, rows, rowsLength,
        trendsArray, trend, rowData, date, year, rawMonth, correctMonth;

      // Handle errors
      if (response.isError()) {
        alert('Error in query: ' + response.getMessage() + ' ' +
          response.getDetailedMessage());
        return;
      }

      d3Helper = bbApp.d3Helper;
      data = response.getDataTable();
      colsLength = data.Kf.length;
      totalWeight = 0;
      weights = bbApp.weights;

      weights.reset();

      for (i = 1; i < colsLength + 1; i++) {
        // termString = d3Helper.createTermsArray(data, i);

        // Process data to get monthly weights table
        weightsArray = d3Helper.calculateWeights(data, colsLength, i);
        termWeight = weightsArray.pop();

        if (i !== colsLength) {
          totalWeight += termWeight;
        }

        weights.add({
          term: termString,
          monthWeights: weightsArray,
          termWeight: termWeight
        });
      }

      weights.each(function(model) {
        modelAttr = model.attributes;
        modelWeights = modelAttr.monthWeights;
        modelPercents = modelWeights.map(calculatePercent);
        termPercent = calculatePercent(modelAttr.termWeight, modelWeights);

        model.set({
          monthPercents: modelPercents,
          termPercent: termPercent
        });
      });

      // Generate trends data table
      monthConverter = {
        January: 'February',
        February: 'March',
        March: 'April',
        April: 'May',
        May: 'June',
        June: 'July',
        July: 'August',
        August: 'September',
        September: 'October',
        October: 'November',
        November: 'December',
        December: 'January'
      };
      rows = data.Lf;
      rowsLength = rows.length;
      trendsArray = [];

      for ( i = 0; i < rowsLength; i++ ) {
        trend = {};
        rowData = rows[ i ].c;
        date = new Date( rowData[ 0 ].v );
        year = date.getFullYear();
        trend.year = year;

        // Split date string into month & year, then get month only
        rawMonth = rowData[ 0 ].f.split( ' ' ).shift();

        // Convert month string to correct month
        correctMonth = monthConverter[ rawMonth ];
        trend.month = correctMonth;

        // Create a new cell in table per data point in row
        for ( j = 1; j < colsLength; j++ ) {
          trend['volume' + j] = rowData[j] ? rowData[ j ].f : 0;
        }

        trendsArray.push(trend);
      }

      console.log(trendsArray);

      // Reveal data tables and auto-scroll down
      bbApp.appRouter.getWeightsTable();

      function calculatePercent (value, array) {
        var total, percent;

        total = totalWeight;
        percent = ((value / total) * 100).toFixed(2);

        return percent;
      }
    }
  };
})(google);