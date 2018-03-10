import Backbone from 'backbone'
import Trend from '../models/trend'

const Trends = Backbone.Collection.extend({ model: Trend })

export default Trends
