'use strict';

var bbApp = bbApp || {};

(function(google) {

  bbApp.GoogleHelper = {
    createQuery: function(action, searchTerms, country, startDate, endDate) {
      var startYM, startYear, startMonth, endYM, endYear, endMonth, today,
        thisYear, thisMonth, url, queryUrl, geoUrl, startUrl, monthUrl,
        dateUrl, monthDiff, params, callUrl, yearString, monthString;
        yearString, monthString;

      // Parse dates for correct format for query string
      startYM = startDate.split('-');
      startYear = parseFloat(startYM[ 0 ]);
      startMonth = parseFloat(startYM[ 1 ]);
      endYM = endDate.split('-');
      endYear = parseFloat(endYM[ 0 ]);
      endMonth = parseFloat(endYM[ 1 ]);
      today = new Date();
      thisYear = today.getFullYear();
      thisMonth = today.getMonth() + 1;

      // Start to build query URL
      url = action;
      queryUrl = 'q=' + encodeURIComponent(searchTerms);
      geoUrl = country === '' ? '' : '&geo=' + encodeURIComponent(country);

      // If no dates chosen, don't specify dates in query URL
      if (startDate === '' && endDate === '') {
        dateUrl = '';

      } else {
        // Set the lower limit for date range (if year or month left blank,
        // they = NaN)
        if (startYear < 2004 && startMonth < 1 || !startYear || !startMonth) {
          startYear = 2004;
          startMonth = 1;
          $('input[name=start]').val('2004-01');
        }

        // Set the upper limit for date range (if year or month left blank,
        // they = NaN)
        if (endYear > thisYear || endYear === thisYear &&
          endMonth > thisMonth || !endYear || !endMonth) {
            endYear = thisYear;
            endMonth = thisMonth;
            yearString = endYear.toString();
            monthString = endMonth < 10 ? '0' + endMonth.toString() :
              endMonth.toString();
            $('input[name=end]').val(yearString + '-' + monthString);
        }

        startUrl = startMonth.toString() + '/' + startYear.toString();
        monthDiff = (endYear - startYear) * 12 - startMonth + endMonth + 1;

        // Month difference must be > 36 for Google Trends to return
        // data by month
        if (monthDiff < 37) {
          return alert('Start and end dates must be more than 3 years apart' +
            ' to get monthly data (otherwise, data is broken down by week)');
        }

        monthUrl = monthDiff.toString() + 'm';
        dateUrl = '&date=' + encodeURIComponent(startUrl + ' ' + monthUrl);
      }

      // Join URL parameter strings, then create the whole URL
      params = '?' + queryUrl + geoUrl + dateUrl +
          '&cid=TIMESERIES_GRAPH_0&export=3';
      callUrl = url + params;

      console.log(callUrl);
      this.getData(callUrl);
    },
    // Make call to Google Trends
    getData: function(url) {
      var query;
      query = new google.visualization.Query(url);
      // query.send(bbApp.d3Helper.processData);
    }
  };
})(google);