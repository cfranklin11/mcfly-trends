import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'

const WeightView = Backbone.View.extend({
  tagName: 'tr',
  template: _.template($('#weight-view').html()),
  initialize () {
    this.render()
  },
  render () {
    const attributes = this.model.toJSON()
    this.$el.html(this.template(attributes))
    return this
  },
})

export default WeightView
