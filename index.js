( function ( $ ) {
  $( 'form' ).submit( function ( event ) {
    event.preventDefault();
    var form = $( 'form' ),
      searchTerms = form.find( 'input[name=terms]' ).val(),
      url = form.attr( 'action' ),
      query = encodeURIComponent( 'q=' + searchTerms ),
      params = '?' + query + '&cid=TIMESERIES_GRAPH_0&export=3',
      dest = url + params;

    $.get( dest, function ( data, response ) {
      console.log(data);
      console.log(response);
    });
  });
})( jQuery );