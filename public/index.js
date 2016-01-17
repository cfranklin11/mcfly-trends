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

google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart () {
  var query = new google.visualization.Query('https://www.google.com/trends/fetchComponent?q=asdf,qwerty&cid=TIMESERIES_GRAPH_0&export=3');
  query.send( handleQueryResponse );
}

function handleQueryResponse(response) {

  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();
  console.log(data);
}