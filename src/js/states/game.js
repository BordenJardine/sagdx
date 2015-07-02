var SwipeManager = require('../utilities/SwipeManager.js');

var Game = function () {
};

module.exports = Game;

Game.prototype = {
  create: function () {
    var x = (this.game.width / 2) - 100;
    var y = (this.game.height / 2);

    // TODO: (Random?) Image and profile

    this.game.plugins.add(new SwipeManager(this.game, {}, this.onSwipe));
  },

  onSwipe: function() {
    console.log('swipe detected!');
  },

  update: function () {
  }
};
