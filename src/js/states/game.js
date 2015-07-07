var SwipeManager = require('../utilities/SwipeManager.js');
var CinderProfile = require('../entities/CinderProfile.js');

var Game = function () {
  currentCinderProfile = null;
  lastSwipeDirection = SwipeManager.SWIPE_DIRECTIONS.RIGHT;
};

Game.prototype = {
  create: function () {
    this.game.plugins.add(new SwipeManager(this.game, {}, this.onSwipe, this));
    currentCinderProfile = new CinderProfile(this.game, lastSwipeDirection);

    this.header = this.add.sprite(0, 0, 'header');
    //add Header
    //add portrait
    //add buttons
    //make buttons clicky
  },

  onSwipe: function(swipeDirection) {
    var to = -this.game.width;
    lastSwipeDirection = swipeDirection;

    if (swipeDirection == SwipeManager.SWIPE_DIRECTIONS.RIGHT) {
      to = this.game.width;
    }

    var tween = this.game.add.tween(currentCinderProfile);
    tween.onComplete.add(this.onTweenComplete, this);
    tween.to({ x: to }, 700, Phaser.Easing.Cubic.Out, true);
    tween.start();
  },

  onTweenComplete: function() {
    // execute currentCinderProfile.selectionResult
    // or generate new profile:
    currentCinderProfile = new CinderProfile(this.game, lastSwipeDirection);
    this.game.time.events.add(2500, this.onTimerComplete, this);
  },

  onTimerComplete: function() {
  },

  update: function () {
  },

  render: function() {
    this.game.debug.text("Time until event: " + this.game.time.events.duration, 32, 32);
  }
};

module.exports = Game;
