'use strict';

var bbApp = bbApp || {};

// Create an individual account row for the accounts table
(function ($) {
  bbApp.TrendsView = Backbone.View.extend({
    el: $('#trends-div'),
    tagName: 'div',
    className: 'col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2',
    template: _.template($('#trends-view').html()),
    initialize: function (options) {
      var colSpan, i;

      // Save terms & # of columns
      this.termCount = options.termCount;
      this.terms = options.terms;

      this.render();

      // Adjust table title row according to # of terms
      colSpan = (this.termCount + 2).toString();
      this.$el.find('th').first().attr('colspan', colSpan);

      for (i = 0; i < this.termCount; i++) {
        this.$el.find('tbody').find('tr').first().append('<th>' + this.terms[i] + '</th>');
      }
    },
    addOne: function(trend) {
      var trendTemplate, i, trendView;

      // Build template based on # of terms
      trendTemplate = '<td><%= year %></td><td><%= month %></td>'

      for (i = 0; i < this.termCount; i++) {
        trendTemplate += '<td><%= volume' + (i + 1).toFixed() + '%></td>';
      }

      trendView = new bbApp.TrendView({
        model: trend,
        templateString: trendTemplate
      });
      this.$el.find('tbody').append(trendView.render().el);
    },
    render: function () {
      this.$el.html(this.template());
      this.collection.each(this.addOne, this);

      return this;
    }
  });
})(jQuery);