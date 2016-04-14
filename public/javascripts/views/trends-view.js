'use strict';

var bbApp = bbApp || {};

// Create an individual account row for the accounts table
( function ( $ ) {
  bbApp.AccountView = Backbone.View.extend({
    el: $('#trends-div'),
    tagName: 'div',
    className: 'col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2',
    template: _.template($('#trends-view').html()),
    initialize: function () {
      var colSpan, length;

      this.render();

      // Adjust table title row
      length = this.collection.length;
      colSpan = ( length + 1 ).toString();
      this.$el.find( 'th' ).first().attr( 'colspan', colSpan );
    },
    addOne: function(trend) {
      var trendView;

      trendView = new bbApp.TrendView({model: trend});
      this.$el.find('tbody').append(trendView.render().el);
    },
    render: function () {
      var length;

      this.$el.html(this.template());
      this.collection.each(this.addOne, this);

      return this;
    }
  });
})(jQuery);