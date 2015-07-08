var SwipeManager = require('../utilities/SwipeManager.js');
var CinderProfile = require('../entities/CinderProfile.js');
var ProfileReveal = require('../entities/ProfileReveal.js');
var TextManager = require('../utilities/TextManager.js');

var Game = function () {
  currentCinderProfile = null;
  lastSwipeDirection = SwipeManager.SWIPE_DIRECTIONS.RIGHT;
  swipeScore = 20;
};

Game.prototype = {
  create: function () {
    this.game.plugins.add(new SwipeManager(this.game, {}, this.swipe, this));
    this.TextManager = new TextManager(this.game);
    currentCinderProfile = new CinderProfile(this.game, lastSwipeDirection);

    this.header = this.add.sprite(0, 0, 'header');

    this.xButton = this.add.button(120, 485, 'xButton', this.nopeButtonCallback.bind(this));
    this.heartButton = this.add.button(212, 485, 'heartButton', this.yepButtonCallback.bind(this));
    this.timerAnimation = this.game.add.sprite(-6, this.game.height - 8, 'timer-animation');

    this.timeDestroyed = false;
    this.timerTween = this.game.add.tween(this.timerAnimation).to({ x: this.game.width}, 2500);
    this.timerTween.onComplete.add(this.onTimerTweenComplete, this);
    this.timerTween.start();
  },

  swipe: function(swipeDirection) {
    var to = -this.game.width * 3;
    var angle = -90;

    this.timerDestroyed = true;
    this.game.tweens.remove(this.timerTween);

    lastSwipeDirection = swipeDirection;

    if (swipeDirection == SwipeManager.SWIPE_DIRECTIONS.RIGHT) {
      to = to * -1;
      angle = angle * -1;
    }

    var scoreMultiplier = -1;
    if (swipeDirection === currentCinderProfile.profile.correctDirection)
      scoreMultiplier = 1;

    window.Score += swipeScore * scoreMultiplier;

    if (swipeScore > 0) {
      var modifier = scoreMultiplier > 0 ? "+" : "";
      this.TextManager.addFloatingText(modifier + (swipeScore * scoreMultiplier));
    }

    this.swipeTo(to, angle);
  },

  onSwipeComplete: function() {
    this.handleReveal()
  },

  handleReveal: function() {
    var reveal = new ProfileReveal(this.game, 0, this.header.height, currentCinderProfile.profile);
    this.game.add.existing(reveal);
    reveal.events.onInputDown.add(function() {
      reveal.kill();
      this.nextProfile();
    }, this);
  },

  nextProfile: function() {
    // execute currentCinderProfile.selectionResult
    // or generate new profile:
    currentCinderProfile = new CinderProfile(this.game, lastSwipeDirection);
    this.timerAnimation.x = -6;

    // todo - subtract score as timer decreases
    swipeScore = 20;

    this.timerDestroyed = false;
    this.timerTween = this.game.add.tween(this.timerAnimation).to({ x: this.game.width}, 2500);
    this.timerTween.onComplete.add(this.onTimerTweenComplete, this);
    this.timerTween.start();
  },

  onTimerTweenComplete: function() {
    if (!this.timerDestroyed) {
        window.Score -= 10;
        this.TextManager.addFloatingText("-10", "down");
        swipeScore = 0;
    }
  },

  nopeButtonCallback: function() {
    this.swipe(SwipeManager.SWIPE_DIRECTIONS.LEFT);
  },

  yepButtonCallback: function() {
    this.swipe(SwipeManager.SWIPE_DIRECTIONS.RIGHT);
  },

  swipeTo: function(to, angle) {
    var stampW = this.game.cache.getImage('nope').width;
    var frameW = this.game.cache.getImage('cinderFrame').width;
    var nopeY = currentCinderProfile.y + frameW - stampW;
    var stamp = null;

    if (to > 0)
      stamp = this.game.add.sprite(currentCinderProfile.y + 32, currentCinderProfile.x + 64, 'like');
    else
      stamp = this.game.add.sprite(nopeY, currentCinderProfile.x + 64, 'nope');

    currentCinderProfile.addChild(stamp);

    var tween = this.game.add.tween(currentCinderProfile);
    tween.onComplete.add(this.onSwipeComplete, this);
    tween.to({ x: to, y: this.game.height / 3, angle: angle }, 1000, Phaser.Easing.Cubic.Out, false, 200);
    tween.start();
  },

  update: function () {
  }
};

module.exports = Game;
