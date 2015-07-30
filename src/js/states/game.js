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
    if (window.Lives <= 0)
      this.game.state.start('gameover');

    this.game.stage.backgroundColor = '#ffffff';
    this.game.world.width = 414;
    this.game.plugins.add(new SwipeManager(this.game, this.swipe, this));
    this.TextManager = new TextManager(this.game);
    currentCinderProfile = new CinderProfile(this.game, lastSwipeDirection);

    if (!this.game.device.desktop) this.input.onDown.add(this.goFullscreen, this);

    this.header = this.add.sprite(0, 0, 'header');
    this.bad = this.game.add.audio('bad');
    this.good = this.game.add.audio('yay');
    this.wabang = this.game.add.audio('wabang');

    this.xButton = this.add.button(115, 485, 'xButton', this.nopeButtonCallback.bind(this));
    this.heartButton = this.add.button(207, 485, 'heartButton', this.yepButtonCallback.bind(this));

    this.hearts = [];

    var heartPadding = 8;
    var cinderFrameW = this.game.cache.getImage('cinderFrame').width;
    var startX = (this.game.width - cinderFrameW) / 2;
    for (var i = 0; i < window.Lives; i++) {
      var h = null;

      // lives sprite / animation
      if (i === 4) startX = startX + this.xButton.width * 2 + 14;
      if (i % 2 !== 0) {
        h = this.game.add.sprite(startX + ((i - 1) / 2) * (32 + heartPadding),
                                this.xButton.y + this.xButton.height / 2 - 16,
                                'heart');
      }
      else {
        h = this.game.add.sprite(startX + (i / 2) * (32 + heartPadding) + 8,
                                 this.xButton.y + this.xButton.height / 2 - 8,
                                 'smallheart');
      }

      this.hearts.push(h);
    }

    this.baseSwipeScore = 25;
    this.swipeScore = this.baseSwipeScore;
    this.updateTime = 0;

    this.swipeEnabled = true;

    if (window.Games === window.TOTAL_GAMES)
      this.TextManager.addFloatingText('critical omission.',
                                       'down',
                                       'something, something,',
                                       null,
                                       null,
                                       20);
  },

  goFullscreen: function() {
    if(this.game.scale.isFullScreen) return;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.startFullScreen(true);
  },

  swipe: function(swipeDirection) {
    if (!this.swipeEnabled) return;
    this.swipeEnabled = false;

    window.Games += 1;

    var to = -this.game.width * 3;
    var angle = -90;

    lastSwipeDirection = swipeDirection;

    if (swipeDirection == SwipeManager.SWIPE_DIRECTIONS.RIGHT) {
      this.good.play();
      window.PlayedGames += 1;
      to = to * -1;
      angle = angle * -1;
    } else {
      this.bad.play();
      window.Lives -= 1;
      this.hearts[this.hearts.length - 1].destroy();
      this.hearts.splice(this.hearts.length - 1, 1);

      if (window.Lives <= 0)
        this.game.state.start('gameover');

      this.swipePenalty();
    }

    this.swipeTo(to, angle);
  },

  swipePenalty: function() {
    window.Score -= this.baseSwipeScore;

    this.TextManager.addFloatingText('-' + this.baseSwipeScore, "up", 'boo');
  },

  onSwipeComplete: function() {
    if (lastSwipeDirection == 1) this.reveal();
    else this.nextProfile();
  },

  reveal: function() {
    this.wabang.play();
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

  },

  nextProfile: function() {
    currentCinderProfile = new CinderProfile(this.game, lastSwipeDirection);
    this.swipeScore = this.baseSwipeScore;
    this.swipeEnabled = true;

    if (window.Games === window.TOTAL_GAMES)
      this.TextManager.addFloatingText('critical omission.',
                                       'down',
                                       'something, something,',
                                       null,
                                       null,
                                       20);
  },

  update: function () {
    this.updateTime += 1;
    if (this.swipeScore > 1 && this.updateTime % 10 === 0) {
      this.swipeScore -= 1;
    }
  },

  onTimerTweenComplete: function() {
    this.bad.play();
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
