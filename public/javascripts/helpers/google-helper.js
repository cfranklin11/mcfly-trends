'use strict';

var bbApp = bbApp || {};

(function(google) {

  bbApp.GoogleHelper = {

    // Make call to Google Trends
    getData: function(url) {
      var query;
      query = new google.visualization.Query(url);
      query.send(bbApp.GoogleHelper.processData);
    },
    // Query callback to process the data object
    processData: function(response) {
      var d3Helper, data, colsLength, totalWeight, weights, i, termString, weightsArray,
        termWeight, model, modelAttr, modelWeights, modelPercents, termPercent, j;

      // Handle errors
      if (response.isError()) {
        alert('Error in query: ' + response.getMessage() + ' ' +
          response.getDetailedMessage());
        return;
      }

      d3Helper = bbApp.D3Helper;
      data = response.getDataTable();
      colsLength = data.Kf.length;
      totalWeight = 0;
      weights = bbApp.weights;

      weights.reset();

      for (i = 1; i < colsLength + 1; i++) {
        termString = d3Helper.createTermsArray(data, i);

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