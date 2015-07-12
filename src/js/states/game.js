var SwipeManager = require('../utilities/SwipeManager.js');
var CinderProfile = require('../entities/CinderProfile.js');
var ProfileReveal = require('../entities/ProfileReveal.js');
var TextManager = require('../utilities/TextManager.js');
var Timer = require('../entities/Timer.js');

var Game = function () {
  currentCinderProfile = null;
  lastSwipeDirection = SwipeManager.SWIPE_DIRECTIONS.RIGHT;
  swipeScore = 20;
};

Game.prototype = {
  create: function () {
    this.game.plugins.add(new SwipeManager(this.game, {}, this.swipe, this));
    this.TextManager = new TextManager(this.game);
    this.Timer = new Timer(this.game, this.onTimerTweenComplete, this);
    currentCinderProfile = new CinderProfile(this.game, lastSwipeDirection);

    this.header = this.add.sprite(0, 0, 'header');
    this.bad = this.game.add.audio('bad');
    this.good = this.game.add.audio('good');

    this.xButton = this.add.button(120, 485, 'xButton', this.nopeButtonCallback.bind(this));
    this.heartButton = this.add.button(212, 485, 'heartButton', this.yepButtonCallback.bind(this));

    this.baseSwipeScore = 20;
    this.swipeScore = this.baseSwipeScore;
    this.updateTime = 0;

    this.swipeEnabled = true;

    this.Timer.start();
  },

  swipe: function(swipeDirection) {
    if (!this.swipeEnabled) return;
    this.swipeEnabled = false;

    var to = -this.game.width * 3;
    var angle = -90;

    this.Timer.end();

    lastSwipeDirection = swipeDirection;

    if (swipeDirection == SwipeManager.SWIPE_DIRECTIONS.RIGHT) {
      to = to * -1;
      angle = angle * -1;
    }

    var scoreMultiplier = 1;
    if (swipeDirection !== currentCinderProfile.profile.correctDirection) {
      scoreMultiplier = -1;
      this.swipeScore = this.baseSwipeScore;
    }

    var scoreChange = this.swipeScore * scoreMultiplier;
    window.Score += scoreChange;

    if (swipeScore > 0) {
      if (scoreMultiplier > 0) this.good.play();
      else this.bad.play();

      var modifier = scoreMultiplier > 0 ? "+" : "";
      var reason = scoreMultiplier > 0 ? "good match!" : "bad match!";
      this.TextManager.addFloatingText(modifier + scoreChange, "up", reason);
    }

    this.swipeTo(to, angle);
  },

  onSwipeComplete: function() {
    this.handleReveal();
  },

  handleReveal: function() {
    this.currentReveal = new ProfileReveal(this.game, 0, this.header.height, currentCinderProfile.profile);

    this.game.add.existing(this.currentReveal);

    //This timeout forces them to look at the reveal image for at least a bit
    this.game.time.events.add(300, function() {
      this.currentReveal.events.onInputDown.add(this.endReveal.bind(this), this);
    }, this);

    this.revealTimeout = this.game.time.events.add(3000, this.endReveal, this);
  },

  endReveal: function() {
    if (this.revealTimeout) this.game.time.events.remove(this.revealTimeout);

    this.currentReveal.kill();

    if (typeof currentCinderProfile.profile.minigame !== "undefined" &&
        lastSwipeDirection === currentCinderProfile.profile.minigameDirection)
      this.game.state.start(currentCinderProfile.profile.minigame);
    else
      this.nextProfile();

    this.swipeEnabled = true;
  },

  nextProfile: function() {
    currentCinderProfile = new CinderProfile(this.game, lastSwipeDirection);

    this.swipeScore = this.baseSwipeScore;

    this.Timer.start();
  },

  update: function () {
    this.updateTime += 1;
    if (this.swipeScore > 1 && this.updateTime % 10 === 0) {
      this.swipeScore -= 1;
    }
  },

  onTimerTweenComplete: function() {
    if (!this.Timer.timerDestroyed) {
      window.Score -= (this.baseSwipeScore / 2);
      this.TextManager.addFloatingText("-" + (this.baseSwipeScore / 2), "down", "out of time!");
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
    //using setTimeout to show reveal before tween completes (hack?)
    this.game.time.events.add(700, this.onSwipeComplete.bind(this), this);
    tween.to({ x: to, y: this.game.height / 3, angle: angle }, 1000, Phaser.Easing.Cubic.Out, false, 200);
    tween.start();
  }
};

module.exports = Game;
