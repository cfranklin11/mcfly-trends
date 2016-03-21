'use strict';

var bbApp = bbApp || {};

// Create an individual account row for the accounts table
(function($) {
  bbApp.WeightView = Backbone.View.extend({
    el: $('#weights-div'),
    tagName: 'div',
    className: 'row',
    template: _.template($('#weight-view').html()),
    initialize: function() {
      this.render();
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    string: function() {

      // Save overall average, multiplied by # of terms, to calculate weights
      avgTotal = avgs[ colCount - 1 ][ 12 ];

      // Loop through avgs array to build a string that will be the html table
      // Loop through the rows
      for ( i = 1; i < colCount + 1; i++ ) {
        // term = data.Kf[ i ] ? "'" + data.Kf[ i ].label + "'" : 'Monthly Weight';
        tableString += '<tr><th>' + term + '</th>';

        // Loop through columns (the months), calculating the weight
        // (mean / (overall mean * # of search terms)) and adding it to the string
        for ( j = 0; j < 12; j++ ) {
          weight = (( avgs[ i - 1 ][ j ] / avgTotal) * 100 ).toFixed( 2 );
          tableString += '<td data-col="' + j + '" class="included" data-weight="' +
            weight + '">' + weight + '%</td>';
        }

        // Calculate overall term weight and add to string
        termWeight = (( avgs[ i - 1 ][ 12 ] / avgTotal ) * 100 ).toFixed( 2 );
        tableString += '<td class="included">' + termWeight + '%</td></tr>';
      }

      return tableString;
    }
  });
})(jQuery);