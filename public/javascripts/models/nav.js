import Backbone from 'backbone'

const Nav = Backbone.Model.extend({
  initialize () {
    const messages = this.attributes.messages
    const messageCount = messages.length
    const message = messages[Math.floor(Math.random() * messageCount)]
    this.set({ message })
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
      'Hoowah!',
    ],
    message: 'message',
  },
})

export default Nav
