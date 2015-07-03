var SwipeManager = require('../utilities/SwipeManager.js');
var CinderProfile = require('../entities/CinderProfile.js');

var Game = function () {
  currentCinderProfile = null
};

Game.prototype = {
  create: function () {
    var x = (this.game.width / 2) - 100;
    var y = (this.game.height / 2);

    this.game.plugins.add(new SwipeManager(this.game, {}, this.onSwipe));

    currentCinderProfile = new CinderProfile(this.game);
  },

  onSwipe: function(swipeDirection) {
    var to = -1000;
    if (swipeDirection == SwipeManager.SWIPE_DIRECTIONS.RIGHT)
      to = 1000;

    console.log(this.onTweenComplete);
    var tween = this.game.add.tween(currentCinderProfile.x)
    tween.onComplete.add(this.onTweenComplete, this);
    tween.to({ x: to }, 100, Phaser.Easing.Quadratic.InOut, true);
    tween.start();
  },

  onTweenComplete: function() {
    alert('here!');
  },

  update: function () {
  }
};

module.exports = Game;
