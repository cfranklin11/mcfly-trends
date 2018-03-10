import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'

import d3Helper from '../helpers/d3-helper'
import WeightView from './weight-view'

const WeightsView = Backbone.View.extend({
  el: $('#weights-div'),
  template: _.template($('#weights-view').html()),
  events: {
    'mousedown th[data-col]': 'selectMonths',
    'mouseover th[data-col]': 'highlightMonths',
    'mouseenter th.included, th.excluded': 'highlightColumns',
    'mouseleave th.included, th.excluded': 'unhighlightColumns',
    'click #reset': 'resetMonths',
  },

  // Save event data in object for column toggle event in router
  mousedown: false,
  included: false,
  cells: {
    firstCell: undefined,
    previousCell: undefined,
    newCell: undefined,
  },
  initialize () {
    this.render()
  },
  addOne (weight) {
    const weightView = new WeightView({ model: weight })
    this.$el.find('tbody').append(weightView.render().el)
  },

  // Handle click on weights column
  selectMonths (event) {
    event.preventDefault()

    const cell = $(event.currentTarget)
    this.mousedown = true
    this.included = cell.hasClass('included')
    this.cells.firstCell = cell
    this.cells.newCell = cell
  },

  // Handle column highlight during mousedown to highlight columns between
  // column clicked and current column with cursor
  highlightMonths (event) {
    // Only active if mouse is down, keep track of first column clicked and
    // previous column hovered with object properties
    if (this.mousedown) {
      const firstCol = +this.cells.firstCell.attr('data-col')
      const prevCell = this.cells.newCell
      this.cells.previousCell = prevCell
      const prevCol = +prevCell.attr('data-col')
      // const prevColCells = prevCell.closest('table').find(`[data-col="${prevCol}"]`)
      const cell = $(event.currentTarget)
      this.cells.newCell = cell
      const col = +cell.attr('data-col')
      // const colCells = cell.closest('table').find(`[data-col="${col}"]`)
      const thisIncluded = this.included

      // const minCol = 11
      // const maxCol = 0

      if (col !== prevCol && col !== firstCol) {
        // Handle highlight if cursor is to the left of first column clicked
        if (col < firstCol) {
          for (let i = 0; i < 12; i += 1) {
            const toggleColCells = cell.closest('table').find(`[data-col="${i}"]`)
            const spans = toggleColCells.find('span')
            const thatIncluded = cell.closest('table').find(`th[data-col="${i}"]`).hasClass('included')

            if (col <= i && i <= firstCol) {
              toggleColCells.addClass('table-hover')

              if (thisIncluded) {
                spans.removeClass('glyphicon-ok-sign')
                spans.addClass('glyphicon-remove-sign')
              } else {
                spans.removeClass('glyphicon-remove-sign')
                spans.addClass('glyphicon-ok-sign')
              }
            } else {
              toggleColCells.removeClass('table-hover')

              if (thatIncluded) {
                spans.removeClass('glyphicon-remove-sign')
                spans.addClass('glyphicon-ok-sign')
              } else {
                spans.removeClass('glyphicon-ok-sign')
                spans.addClass('glyphicon-remove-sign')
              }
            }
          }

          // const minCol = col

        // Handle highlight if cursor is to the right of first column clicked
        } else {
          for (let i = 0; i < 12; i += 1) {
            const toggleColCells = cell.closest('table').find(`[data-col="${i}"]`)
            const spans = toggleColCells.find('span')
            const thatIncluded = cell.closest('table').find(`th[data-col="${i}"]`).hasClass('included')

            if (firstCol <= i && i <= col) {
              toggleColCells.addClass('table-hover')

              if (thisIncluded) {
                spans.removeClass('glyphicon-ok-sign')
                spans.addClass('glyphicon-remove-sign')
              } else {
                spans.removeClass('glyphicon-remove-sign')
                spans.addClass('glyphicon-ok-sign')
              }
            } else {
              toggleColCells.removeClass('table-hover')

              if (thatIncluded) {
                spans.removeClass('glyphicon-remove-sign')
                spans.addClass('glyphicon-ok-sign')
              } else {
                spans.removeClass('glyphicon-ok-sign')
                spans.addClass('glyphicon-remove-sign')
              }
            }
          }

          // const maxCol = col
        }
      }
    }
  },

  // Handle column highlighting with mouseenter (only if mouse is not down)
  highlightColumns (event) {
    const self = $(event.currentTarget)

    const column = self.attr('data-col')
    const columnCells = $('#table1').find(`[data-col="${column}"]`)
    const span = self.find('span')
    const included = self.hasClass('included')

    if (!this.mousedown) {
      columnCells.addClass('table-hover')

      if (included) {
        span.removeClass('glyphicon-ok-sign')
        span.addClass('glyphicon-remove-sign')
      } else {
        span.removeClass('glyphicon-remove-sign')
        span.addClass('glyphicon-ok-sign')
      }
    }
  },

  // Handle removal of column highlighting with mouseleave
  // (only if mouse is not down)
  unhighlightColumns (event) {
    const self = $(event.currentTarget)

    const column = self.attr('data-col')
    const columnCells = $('#table1').find(`[data-col="${column}"]`)
    const span = self.find('span')
    const included = self.hasClass('included')

    columnCells.removeClass('table-hover')

    if (included) {
      span.removeClass('glyphicon-remove-sign')
      span.addClass('glyphicon-ok-sign')
    } else {
      span.removeClass('glyphicon-ok-sign')
      span.addClass('glyphicon-remove-sign')
    }
  },

  // Activate (make included) all months
  resetMonths () {
    const excludedCells = $('#table1').find('.excluded')
    excludedCells.removeClass('excluded')
    excludedCells.addClass('included')

    const spans = $('#table1').find('th.included').find('span')
    spans.removeClass('glyphicon-remove-sign')
    spans.addClass('glyphicon-ok-sign')

    d3Helper.recalculatePercents()
  },
  render () {
    this.$el.html(this.template())
    this.collection.each(this.addOne, this)

    return this
  },
})

export default WeightsView
