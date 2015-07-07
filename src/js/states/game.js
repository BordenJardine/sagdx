var SwipeManager = require('../utilities/SwipeManager.js');
var CinderProfile = require('../entities/CinderProfile.js');

var Game = function () {
  currentCinderProfile = null;
  lastSwipeDirection = SwipeManager.SWIPE_DIRECTIONS.RIGHT;
};

Game.prototype = {
  create: function () {
    this.game.plugins.add(new SwipeManager(this.game, {}, this.swipe, this));
    currentCinderProfile = new CinderProfile(this.game, lastSwipeDirection);

    this.header = this.add.sprite(0, 0, 'header');

    this.xButton = this.add.button(100, 475, 'xButton', this.nopeButtonCallback.bind(this));
    this.heartButton = this.add.button(212, 475, 'heartButton', this.yepButtonCallback.bind(this));
    //add portrait
  },

  swipe: function(swipeDirection) {
    var to = -this.game.width;
    lastSwipeDirection = swipeDirection;

    if (swipeDirection == SwipeManager.SWIPE_DIRECTIONS.RIGHT) {
      to = this.game.width;
    }

    this.swipeTo(to);
  },

  onTweenComplete: function() {
    // execute currentCinderProfile.selectionResult
    // or generate new profile:
    currentCinderProfile = new CinderProfile(this.game, lastSwipeDirection);
  },

  nopeButtonCallback: function() {
    this.swipe(SwipeManager.SWIPE_DIRECTIONS.LEFT);
  },

  yepButtonCallback: function() {
    this.swipe(SwipeManager.SWIPE_DIRECTIONS.RIGHT);
  },

  swipeTo: function(to) {
    var tween = this.game.add.tween(currentCinderProfile);
    tween.onComplete.add(this.onTweenComplete, this);
    tween.to({ x: to }, 700, Phaser.Easing.Cubic.Out, true);
    tween.start();
  },

  update: function () {
  }
};



module.exports = Game;
