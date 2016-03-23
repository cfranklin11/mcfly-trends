'use strict';

var bbApp = bbApp || {};

// Create an individual account row for the accounts table
(function($) {
  bbApp.FormView = Backbone.View.extend({
    el: $('#form-div'),
    tagName: 'div',
    className: 'row',
    template: _.template($('#form-view').html()),
    events: {
      'keyup #terms': 'toggleSubmitBtn',
      'submit form': 'queryGoogleTrends'
    },
    initialize: function() {
      this.render();
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    toggleSubmitBtn: function() {
      var text, submitBtn, submitDisabled;

      text = $('#terms').val();
      submitBtn = $('#search-submit');
      submitDisabled = submitBtn.prop('disabled');

      if (text !== '' && submitDisabled) {
        submitBtn.prop('disabled', false);
      }
      if (text === '' && !submitDisabled) {
        submitBtn.prop('disabled', true);
      }
    },
    queryGoogleTrends: function(event) {
      event.preventDefault();
      var form, action, searchTerms, country, startDate, endDate, termString,
        startYM, startYear, startMonth, endYM, endYear, endMonth, today,
        thisYear, thisMonth, queryUrl, geoUrl, startUrl, monthUrl, dateUrl,
        monthDiff, callParams, callUrl, yearString, monthString, routePath,
        params;

      form = $('form');
      action = form.attr('action');
      searchTerms = form.find('input[name=terms]').val();
      country = form.find('select[name=country]').val();
      startDate = form.find('input[name=start]').val();
      endDate = form.find('input[name=end]').val();

      // Parse dates for correct format for query string
      startYM = startDate.split('-');
      startYear = parseFloat(startYM[0]);
      startMonth = parseFloat(startYM[1]);
      endYM = endDate.split('-');
      endYear = parseFloat(endYM[0]);
      endMonth = parseFloat(endYM[1]);
      today = new Date();
      thisYear = today.getFullYear();
      thisMonth = today.getMonth() + 1;

      // Start to build query URL
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

      // Join URL parameter strings, then create the router path
      params = queryUrl + geoUrl + dateUrl;
      routePath = params;
      bbApp.appRouter.navigate('#/' + params, {trigger: true});
    },
  });
})(jQuery);