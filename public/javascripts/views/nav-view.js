'use strict';

var bbApp = bbApp || {};

(function($) {
  bbApp.NavView = Backbone.View.extend({
    el: $('#nav-div'),
    tagName: 'div',
    className: 'row text-center',
    template: _.template($('#nav-view').html()),
    events: {
      '#csv click': 'createCsv',
      '#reset click': 'resetMonths',
      '#top click': 'goToTop',
      'window scroll': 'toggleNav'
    },
    initialize: function() {
      this.render();
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    createCsv: function() {
      var tables, tableCount, csvContent, table, thead, titles, titleCount,
        tbody, tableRows, rowCount, colCount, title, tableRow, tableCells,
        cell, encodedUri, link, i, j, k;

        tables = $( 'table' );
        tableCount = tables.length;
        csvContent = "data:text/csv;charset=utf-8,";

      // Create CSV string from data table on page
      // Iterate through each table
      for ( i = 0; i < tableCount; i++ ) {

        table = tables[ i ];
        thead = $( table ).children( 'thead' );
        titles = thead.find( 'h4' );
        titleCount = titles.length;
        tbody = $( table ).children( 'tbody' );
        tableRows = tbody.children( 'tr' );
        rowCount = tableRows.length;
        colCount = tableRows.first().children( 'th' ).length;

        // Add table titles separately with an extra space below
        for( j = 0; j < titleCount; j++ ) {
          title = $( titles[ j ]).text();
          csvContent += title + '\n';
        }
        csvContent += '\n';

        // Iterate through each row
        for ( j = 0; j < rowCount; j++ ) {
          tableRow = tableRows[ j ];
          tableCells = $( tableRow ).children( 'th,td' );


          // Iterate through each cell in the row, adding the text
          // to the row string
          for ( k = 0; k < colCount; k++ ) {
            cell = tableCells[ k ];
            csvContent += $( cell ).text();

            // Commas to separate columns, finishing with a line break
            // at the end of the row
            csvContent += k < colCount - 1 ? ',' : '\n';
          }
        }
        csvContent += '\n\n';
      }

      // Use CSV string to create CSV file, then download it
      encodedUri = encodeURI( csvContent );
      link = document.createElement( 'a' );
      link.setAttribute( 'href', encodedUri );
      link.setAttribute( 'download', 'monthly-data.csv');

      link.click();
    },
    resetMonths: function() {
      var excludedCells;

      excludedCells = $( '#table1' ).find( '.excluded' );
      excludedCells.removeClass( 'excluded' );
      excludedCells.addClass( 'included' );
      calculateWeights();
    },
    goToTop: function() {
      $( 'body' ).animate({ scrollTop: 0 }, 'slow' );
    },
    toggleNav: function() {
      var navDiv, nav, navDivPos, browserPos;

        navDiv = $( '#nav-div' );
        nav = $( 'nav' );
        navDivPos = navDiv[ 0 ].offsetTop;
        browserPos = window.pageYOffset;

      if ( browserPos > navDivPos ) {
        nav.addClass( 'navbar-fixed-top' );
      }

      if ( browserPos < navDivPos ) {
        nav.removeClass( 'navbar-fixed-top' );
      }
    }
  });
})(jQuery);
