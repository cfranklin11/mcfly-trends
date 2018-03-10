import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'

const NavView = Backbone.View.extend({
  el: $('#nav-div'),
  template: _.template($('#nav-view').html()),
  events: {
    'click #csv': 'createCsv',
    'click #top': 'goToTop',
  },
  initialize () {
    this.render()
    $(window).scroll(this.toggleNav)
  },
  createCsv () {
    const tables = $('table')
    const tableCount = tables.length
    let csvContent = 'data:text/csvcharset=utf-8,'

    // Create CSV string from data table on page
    // Iterate through each table
    for (let i = 0; i < tableCount; i += 1) {
      const table = tables[i]
      const thead = $(table).children('thead')
      const titles = thead.find('h4')
      const titleCount = titles.length
      const tbody = $(table).children('tbody')
      const tableRows = tbody.children('tr')
      const rowCount = tableRows.length
      const colCount = tableRows.first().children('th').length

      // Add table titles separately with an extra space below
      for (let j = 0; j < titleCount; j += 1) {
        const title = $(titles[j]).text()
        csvContent += `${title}\n`
      }
      csvContent += '\n'

      // Iterate through each row
      for (let j = 0; j < rowCount; j += 1) {
        const tableRow = tableRows[j]
        const tableCells = $(tableRow).children('th,td')


        // Iterate through each cell in the row, adding the text
        // to the row string
        for (let k = 0; k < colCount; k += 1) {
          const cell = tableCells[k]
          csvContent += $(cell).text()

          // Commas to separate columns, finishing with a line break
          // at the end of the row
          csvContent += k < colCount - 1 ? ',' : '\n'
        }
      }
      csvContent += '\n\n'
    }

    // Use CSV string to create CSV file, then download it
    const encodedUri = encodeURI(csvContent)
    const linkTag = document.createElement('a')
    linkTag.setAttribute('href', encodedUri)
    linkTag.setAttribute('download', 'monthly-data.csv')

    linkTag.click()
  },
  goToTop () {
    $('body').animate({ scrollTop: 0 }, 'slow')
  },
  toggleNav () {
    const navDiv = $('#nav-bar')
    const nav = $('nav')
    const navDivPos = navDiv[0].offsetTop
    const browserPos = window.pageYOffset

    if (browserPos > navDivPos) {
      nav.addClass('navbar-fixed-top')
    }

    if (browserPos < navDivPos) {
      nav.removeClass('navbar-fixed-top')
    }
  },
  render () {
    const attributes = this.model.toJSON()
    this.$el.html(this.template(attributes))
    return this
  },
})

export default NavView
