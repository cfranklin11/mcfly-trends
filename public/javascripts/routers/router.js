import Backbone from 'backbone'
import $ from 'jquery'

import d3Helper from '../helpers/d3-helper'

import Trends from '../collections/trends'
import Weights from '../collections/weights'

import Nav from '../models/nav'

import FormView from '../views/form-view'
import NavView from '../views/nav-view'
import TrendsView from '../views/trends-view'
import WeightsView from '../views/weights-view'

const AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
  },
  start () {
    Backbone.history.start()
  },
  index () {
    this.formView = new FormView()
  },
  createTables () {
    const self = this
    let termString = ''
    const weights = new Weights()
    const weightsLength = weights.length
    const weightsArray = []

    function toggleMonths () {
      const mousedown = self.weightsView.mousedown
      const included = self.weightsView.included

      if (mousedown) {
        const toggleCells = $('.table-hover')
        const spans = $('th.table-hover').find('span')

        self.weightsView.mousedown = false
        toggleCells.removeClass('table-hover')

        if (included) {
          toggleCells.removeClass('included')
          toggleCells.addClass('excluded')

          spans.removeClass('glyphicon-ok-sign')
          spans.addClass('glyphicon-remove-sign')
        } else {
          toggleCells.removeClass('excluded')
          toggleCells.addClass('included')

          spans.removeClass('glyphicon-remove-sign')
          spans.addClass('glyphicon-ok-sign')
        }

        d3Helper.recalculatePercents()
      }
    }

    for (let i = 0; i < weightsLength - 1; i += 1) {
      const model = weights.models[i]
      if (i === weightsLength - 2) {
        if (weightsLength > 2) {
          termString += `and ${model.attributes.term}.`
        } else {
          termString += `${model.attributes.term}.`
        }
      } else if (weightsLength > 3) {
        termString += `${model.attributes.term}, `
      } else {
        termString += `${model.attributes.term} `
      }

      weightsArray.push(model.attributes.term)
    }

    this.nav = new Nav({ terms: termString })
    this.navView = new NavView({ model: this.nav })
    this.weightsView = new WeightsView({ collection: weights })
    this.trendsView = new TrendsView({
      collection: new Trends(),
      termCount: weightsLength - 1,
      terms: weightsArray,
    })

    // Create event listener to toggle active/inactive columns
    // in weights view
    $(document).mouseup(toggleMonths)

    const weightsDiv = $('#nav-div')
    const scrollTarget = weightsDiv.offset()
    $('body').animate({ scrollTop: scrollTarget.top }, 'slow')
  },
})

const appRouter = new AppRouter()
export default appRouter
