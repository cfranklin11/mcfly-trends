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
    queryGoogleTrends: function() {

    }
  });
})(jQuery);