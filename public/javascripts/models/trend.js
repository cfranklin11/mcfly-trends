import Backbone from 'backbone'

const Trend = Backbone.Model.extend({
  defaults: {
    year: 1984,
    month: 'January',
    volume: 0,
  },
})

export default Trend
