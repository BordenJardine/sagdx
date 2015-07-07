var SwipeManager = require('../utilities/SwipeManager.js');
var CinderProfile = require('../entities/CinderProfile.js');

var Game = function () {
  currentCinderProfile = null;
  lastSwipeDirection = SwipeManager.SWIPE_DIRECTIONS.RIGHT;
  swipeScore = 20;
};

Game.prototype = {
  create: function () {
    this.game.plugins.add(new SwipeManager(this.game, {}, this.onSwipe, this));
    currentCinderProfile = new CinderProfile(this.game, lastSwipeDirection);

    this.header = this.add.sprite(0, 0, 'header');
    this.timerAnimation = this.game.add.sprite(-32, this.game.height - 32, 'timer-animation');
    this.timerAnimation.animations.add('timer', [0, 1, 2, 3, 4, 5]);
    this.timerAnimation.play('timer', 8, true);

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

    var scoreMultiplier = -1;
    if (swipeDirection === currentCinderProfile.profile.correctDirection)
      scoreMultiplier = 1;

    window.Score += swipeScore * scoreMultiplier;

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
    this.timerAnimation.x = 16;

    swipeScore = 20;

    var tween = this.game.add.tween(this.timerAnimation).to({ x: this.game.width - 32}, 2500);
    tween.onComplete.add(this.onTimerTweenComplete, this);
    tween.start();
  },

  onTimerTweenComplete: function() {
    // explosion animation, etc?
    this.timerAnimation.x = -32;
  },

  onTimerComplete: function() {
    window.Score -= 10;
    swipeScore = 0;
  },

  update: function () {
  },
};

module.exports = Game;
