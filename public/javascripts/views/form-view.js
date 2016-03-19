'use strict';

var bbApp = bbApp || {};

// Create an individual account row for the accounts table
(function($) {
  bbApp.FormView = Backbone.View.extend({
    el: $('#container-div'),
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
      var form, action, searchTerms, country, startDate, endDate, termsArray,
        termString;

      form = $('form');
      action = form.attr('action');
      searchTerms = form.find('input[name=terms]').val();
      country = form.find('select[name=country]').val();
      startDate = form.find('input[name=start]').val();
      endDate = form.find('input[name=end]').val();

      termString = searchTerms.replace(/,\s*/g, '-');
      termString = termString.replace(/\s+/g, '+');

      bbApp.AccountRouter.navigate('#/' + termString);
      bbApp.GoogleHelper.createQuery(action, searchTerms, country, startDate, endDate);
    }
  });
})(jQuery);