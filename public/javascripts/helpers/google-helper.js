'use strict';

var bbApp = bbApp || {};

(function(google) {

  bbApp.GoogleHelper = {

    // Make call to Google Trends
    getData: function(url) {
      var query;
      query = new google.visualization.Query(url);
      query.send(bbApp.d3Helper.processData);
    }
  };
})(google);