'use strict';

var bbApp = bbApp || {};

(function() {
  bbApp.Nav = Backbone.Model.extend({
    initialize: function() {
      var messages, messageCount, message;

      messages = this.attributes.messages;
      messageCount = messages.length;
      message = messages[ Math.floor( Math.random() * messageCount )];
      this.set({message: message});
    },
    defaults: {
      terms: 'term, term, and term',
      messages: [
        'Enjoy!',
        'Rock on!',
        'Keep it real!',
        'Wango the tango!',
        'Buen provecho!',
        'Bon appetit!',
        'Bom proveito!',
        "L'chaim!",
        'Cheers!',
        'Salud!',
        'Salut!',
        'Seize the day!',
        'Everyday!',
        'Booyah!',
        'Hoowah!'
      ],
      message: 'message'
    }
  });
})();