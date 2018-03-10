import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'

import TrendView from './trend-view'

const TrendsView = Backbone.View.extend({
  el: $('#trends-div'),
  tagName: 'div',
  className: 'col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2',
  template: _.template($('#trends-view').html()),
  initialize (options) {
    // Save terms & # of columns
    this.termCount = options.termCount
    this.terms = options.terms

    this.render()

    // Adjust table title row according to # of terms
    const colSpan = (this.termCount + 2).toString()
    this.$el.find('th').first().attr('colspan', colSpan)

    for (let i = 0; i < this.termCount; i += 1) {
      this.$el.find('tbody').find('tr').first().append(`<th>${this.terms[i]}</th>`)
    }
  },
  addOne (trend) {
    // Build template based on # of terms
    let trendTemplate = '<td><%= year %></td><td><%= month %></td>'

    for (let i = 0; i < this.termCount; i += 1) {
      trendTemplate += `<td><%= volume${i} %></td>`
    }

    const trendView = new TrendView({
      model: trend,
      templateString: trendTemplate,
    })
    this.$el.find('tbody').append(trendView.render().el)
  },
  render () {
    this.$el.html(this.template())
    this.collection.each(this.addOne, this)

    return this
  },
})

export default TrendsView
