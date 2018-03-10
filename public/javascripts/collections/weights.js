import Backbone from 'backbone'
import Weight from '../models/weight'

const Weights = Backbone.Collection.extend({ model: Weight })

export default Weights
