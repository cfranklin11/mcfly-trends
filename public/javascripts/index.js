

//////////////////////////////
//// CREATE TABLE STRINGS ////
//////////////////////////////

// Create raw trends table
// function trendsTable ( data ) {
//   'use strict';

//   var colLabels = data.Kf,
//     colsLength = colLabels.length,
//     rows = data.Lf,
//     rowsLength = rows.length,
//     termsArray = [],
//     tableString = '<tr><th>Year</th><th>Month</th>',
//     monthConverter = {
//       January: 'February',
//       February: 'March',
//       March: 'April',
//       April: 'May',
//       May: 'June',
//       June: 'July',
//       July: 'August',
//       August: 'September',
//       September: 'October',
//       October: 'November',
//       November: 'December',
//       December: 'January'
//     },
//     dateData, rowData, rawMonth, correctMonth, date, year, i, j;

//   // After month/year, add 1 column label per search term
//   for ( i = 1; i < colsLength; i++ ) {
//     tableString += '<th>' + "'" + colLabels[ i ].label + "'" +
//       ' Search Volume</th>';
//   }
//   tableString += '</tr>';

//   // Create new row
//   for ( i = 0; i < rowsLength; i++ ) {
//     tableString += '<tr>';
//     rowData = rows[ i ].c;
//     date = new Date( rowData[ 0 ].v );
//     year = date.getFullYear();

//     // Split date string into month & year, then get month only
//     rawMonth = rowData[ 0 ].f.split( ' ' ).shift();

//     // Convert month string to correct month
//     correctMonth = monthConverter[ rawMonth ];

//     // Add year/month labels to row
//     tableString += '<td>' + year + '</td><td>' + correctMonth + '</td>';

//     // Create a new cell in table per data point in row
//     for ( j = 1; j < colsLength; j++ ) {
//       if ( rowData[ j ]) {
//         tableString += '<td>' + rowData[ j ].f + '</td>';
//       }
//     }

//     // Close the row
//     tableString += '</tr>';
//   }
//   return [ tableString ];
// }