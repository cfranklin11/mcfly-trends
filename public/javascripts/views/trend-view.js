'use strict';

var bbApp = bbApp || {};

// Create an individual account row for the accounts table
( function ( $ ) {
  bbApp.AccountView = Backbone.View.extend({
    tagName: 'tr',
    className: 'acct',
    template: _.template(
      '<td><img src="<%= image %>" width="100%" alt=" logo"></td><td><%= account %></td>'
    ),
    initialize: function () {
      this.render();
    },
    render: function () {
      var attributes = this.model.toJSON();
      this.$el.html( this.template( attributes ));

      // Adjust table title row
      colSpan = ( colsLength + 1 ).toString();
      table2.find( 'tr' ).first().children( 'th' ).attr( 'colspan', colSpan );

      return this;
    }
  });
})( jQuery );