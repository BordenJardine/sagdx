var TextManager = require('../utilities/TextManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');
var SwipeManager = require('../utilities/SwipeManager.js');

var SWIPES_PER_STAGE = 4;
var BASE_STAGE_TIME = 1600;

var SnakeGame = function () {
};

SnakeGame.prototype = {
  create: function () {
    this.bad = this.game.add.audio('bad');
    this.good = this.game.add.audio('good');

    if (!this.game.device.desktop) this.input.onDown.add(this.goFullscreen, this);

    this.TextManager = new TextManager(this.game);

    this.game.stage.backgroundColor = '#2b2544';

    this.game.plugins.add(new SwipeManager(this.game, this.swipe, this, true));

    this.TimeUp = new Timer(this.game, 10000, this.onTimeUp, this);

    this.stageTime = BASE_STAGE_TIME - (window.SpeedMultiplier * 100);

    this.condomTimer = null;

    this.snake = this.game.add.sprite(0, 190, 'snake');
    this.condom = this.game.add.sprite(0, 95, 'condom');

    this.condomState = 0;
    this.swipeCount = 0;

    this.snake.x = (this.game.width / 2) - (this.snake.width / 2);
    this.condom.x = (this.game.width / 2) - (this.condom.width / 2);

    this.snake.animations.add('wriggle');
    this.snake.animations.play('wriggle', 1.2 * window.SpeedMultiplier, true);

    this.ready = false;

    this.inter = new Interstitial(this.game, "WRAP IT UP", 1500, function() {
      this.inter.destroy();
      this.ready = true;
      this.TimeUp.start();
    }, this);
  },

  goFullscreen: function() {
    if(this.game.scale.isFullScreen) return;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.startFullScreen(true);
  },

  update: function() {
    if (!this.ready) return;
  },

  swipe: function(swipeDirection) {
    if(!this.ready) return;

    if (swipeDirection == SwipeManager.SWIPE_DIRECTIONS.DOWN) {
      this.onSwipeDown();
    }
  },

  onSwipeDown: function() {
    this.swipeCount++;
    if(this.swipeCount >= SWIPES_PER_STAGE) this.changeCondomState(1);
  },

  restartCondomTimer: function() {
    var timeEvents = this.game.time.events;
    if(this.condomTimer) timeEvents.remove(this.condomTimer);

    this.condomTimer = timeEvents.add(this.stageTime, this.retreatCondom, this);
  },

  retreatCondom: function() {
    this.changeCondomState(-1);
  },

  changeCondomState: function(change) {
    if (!this.ready) return;

    this.restartCondomTimer();

    this.swipeCount = 0;

    this.condomState += change;

    if(this.condomState < 0) {
      this.condomState = 0;
      return;
    };

    this.condom.frame = this.condomState;

    if(this.condomState > 2) {
      this.win();
      return;
    };
  },

  onTimeUp: function () {
    this.snakeBite();
    this.lose();
  },

  snakeBite: function () {
    this.game.add.image(80, 45, 'snakeBite');
    this.condom.angle += 35;
  },

  lose: function () {
    this.bad.play();
    this.ready = false;
    window.Score -= 100;
    window.Lives -= 2;
    this.TextManager.statusText("LOSE!");
    this.game.time.events.add(2000, this.end, this);
  },

  win: function () {
    this.good.play();
    this.ready = false;
    window.SpeedMultiplier += 0.5;
    window.Score += 100;
    this.TextManager.statusText("WIN!");
    this.TimeUp.end();
    this.game.time.events.add(2000, this.end, this);
  },

  end: function() {
    this.game.state.start('Game');
    this.game.stage.backgroundColor = '#FFFFFF';
  }
};

module.exports = SnakeGame;
