import Backbone from 'backbone'
import _ from 'underscore'

const TrendView = Backbone.View.extend({
  tagName: 'tr',
  initialize (options) {
    // Create template based on html string passed at instantiation
    this.template = _.template(options.templateString)
    this.render()
  },
  render () {
    const attributes = this.model.toJSON()
    this.$el.html(this.template(attributes))

    return this
  },
})

export default TrendView
