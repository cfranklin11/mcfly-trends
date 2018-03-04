/* eslint-disable */

'use strict';

var bbApp = bbApp || {};

// Create an individual account row for the accounts table
(function($) {
  bbApp.FormView = Backbone.View.extend({
    el: $('#form-div'),
    template: _.template($('#form-view').html()),
    events: {
      'keyup #terms': 'toggleSubmitBtn',
      'submit form': 'queryGoogleTrends'
    },
    initialize: function() {
      this.render();
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
      var form, action, searchTerms, country, startDate, endDate, termString,
        startYM, startYear, startMonth, endYM, endYear, endMonth, today,
        thisYear, thisMonth, queryUrl, geoUrl, startUrl, monthUrl, dateUrl,
        monthDiff, callParams, callUrl, yearString, monthString, routePath,
        params;

      event.preventDefault();

      form = $('form');
      action = form.attr('action');
      searchTerms = form.find('input[name=terms]').val();
      country = form.find('select[name=country]').val();
      startDate = form.find('input[name=start]').val();
      endDate = form.find('input[name=end]').val();

      // Start to build query object
      var params = {
        keyword: searchTerms.split(/,\s+?/),
        geo: country,
        startTime: startDate === '' ? '' : new Date(startDate),
        endTime: endDate === '' ? '' : new Date(endDate),
      }

      $.post(
        '/data',
        params,
        function (response) {
          bbApp.dataHelper.processData(response)
        }
      )
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });
})(jQuery);
