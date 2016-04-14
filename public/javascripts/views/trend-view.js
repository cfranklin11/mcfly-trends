'use strict';

var bbApp = bbApp || {};

// Create an individual account row for the accounts table
( function ( $ ) {
  bbApp.TrendView = Backbone.View.extend({
    tagName: 'tr',
    initialize: function (options) {

      // Create template based on html string passed at instantiation
      this.template = _.template(options.templateString);
      this.render();
    },
    render: function () {
      var attributes = this.model.toJSON();
      this.$el.html( this.template( attributes ));

      return this;
    }
  });
})( jQuery );