'use strict';

var bbApp = bbApp || {};

// Create an individual account row for the accounts table
(function($) {
  bbApp.WeightView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#weight-view').html()),
    initialize: function() {
      this.render();
    },
    render: function() {
      var attributes;

      attributes = this.model.toJSON();
      this.$el.html(this.template(attributes));
      return this;
    }
  });
})(jQuery);