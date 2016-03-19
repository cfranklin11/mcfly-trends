'use strict';

var bbApp = bbApp || {};

// Create an individual account row for the accounts table
(function($) {
  bbApp.WeightView = Backbone.View.extend({
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
    }
  });
})(jQuery);