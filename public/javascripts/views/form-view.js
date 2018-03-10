import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'

import dataHelper from '../helpers/data-helper'

// Create an individual account row for the accounts table
const FormView = Backbone.View.extend({
  el: $('#form-div'),
  template: _.template($('#form-view').html()),
  events: {
    'keyup #terms': 'toggleSubmitBtn',
    'submit form': 'queryGoogleTrends',
  },
  initialize () {
    this.render()
  },
  toggleSubmitBtn () {
    const text = $('#terms').val()
    const submitBtn = $('#search-submit')
    const submitDisabled = submitBtn.prop('disabled')

    if (text !== '' && submitDisabled) {
      submitBtn.prop('disabled', false)
    }
    if (text === '' && !submitDisabled) {
      submitBtn.prop('disabled', true)
    }
  },
  queryGoogleTrends (event) {
    event.preventDefault()

    const form = $('form')
    const searchTerms = form.find('input[name=terms]').val()
    const country = form.find('select[name=country]').val()
    const startDate = form.find('input[name=start]').val()
    const endDate = form.find('input[name=end]').val()

    // Start to build query object
    const params = {
      keyword: searchTerms.split(/,\s+?/),
      geo: country,
      startTime: startDate === '' ? '' : new Date(startDate),
      endTime: endDate === '' ? '' : new Date(endDate),
    }

    $.post(
      '/data',
      params,
      (response) => {
        dataHelper.processData(response)
      },
    )
  },
  render () {
    this.$el.html(this.template())
    return this
  },
})

export default FormView
