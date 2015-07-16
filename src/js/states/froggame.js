var TextManager = require('../utilities/TextManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');
var WIN_X = 1080;
var PLAYER_Y = 290;
var SHOE_Y = 470;

var FrogGame = function () {
};

FrogGame.prototype = {
  create: function () {
    var self = this;

    this.game.world.width = 1200;
    this.game.camera.setBoundsToWorld();

    this.TextManager = new TextManager(this.game);
    this.Timer = null;

    var playerW = this.game.cache.getImage('frogPlayer').width;

    this.background = this.game.add.image(0, 0, 'frogHaus');
    this.player = this.game.add.sprite(this.game.width / 2 - playerW / 2, 290, 'frogPlayer');
    this.player.animations.add('idle', [0]);
    this.player.animations.add('left', [1]);
    this.player.animations.add('right', [2]);
    this.player.animations.play('idle', 0, true);

    this.frog = this.game.add.sprite(this.player.x - 350, PLAYER_Y, 'frogChaser');
    this.frog.animations.add('run');
    this.frog.animations.play('run', 10, true);

    this.setupShoes();

    this.frogSpeed = 2.5 * window.SpeedMultiplier;
    this.playerSpeed = 25 * window.SpeedMultiplier;

    this.ready = false;

    this.game.camera.follow(this.player);

    this.inter = new Interstitial(this.game, "GET OUT", 1000, function() {
      this.inter.destroy();
      this.ready = true;
    }, this);
  },

  setupShoes: function() {
    this.leftShoe = this.game.add.sprite(65, SHOE_Y, 'leftShoe');
    this.rightShoe = this.game.add.sprite(295, SHOE_Y, 'rightShoe');

    this.leftShoe.animations.add('idle', [0]);
    this.rightShoe.animations.add('idle', [0]);
    this.leftShoe.animations.add('flash', [1,2]);
    this.rightShoe.animations.add('flash', [1,2]);

    this.leftShoe.fixedToCamera = true;
    this.rightShoe.fixedToCamera = true;

    this.leftShoe.inputEnabled = false;
    this.rightShoe.inputEnabled = false;

    this.leftShoe.events.onInputDown.add(function() {
      this.player.animations.play('left', 10, false);
      this.player.events.onAnimationComplete.add(this.idlePlayer, this);
      this.movePlayer();
      this.activateShoe(this.rightShoe, this.leftShoe);
    }, this);

    this.rightShoe.events.onInputDown.add(function() {
      this.player.animations.play('right', 10, false);
      this.player.events.onAnimationComplete.add(this.idlePlayer, this);
      this.movePlayer();
      this.activateShoe(this.leftShoe, this.rightShoe);
    }, this);

    this.activateShoe(this.leftShoe, this.rightShoe);
  },

  activateShoe: function(activeShoe, unactiveShoe) {
    activeShoe.animations.play('flash', 50, true);
    activeShoe.inputEnabled = true;

    unactiveShoe.animations.play('idle', 50, true);
    unactiveShoe.inputEnabled = false;
  },

  idlePlayer: function() {
    this.player.animations.play('idle', 5, true);
  },

  update: function() {
    if (!this.ready) return;

    if(this.frog.x + (this.frog.width * 0.666) > this.player.x) this.lose();

    if(this.player.x > WIN_X) this.win();

    this.moveFrogTowardPlayer();
  },

  movePlayer: function() {
    if (!this.ready) return;
    this.player.x += this.playerSpeed;
  },

  moveFrogTowardPlayer: function() {
    if (this.frog.x < this.player.x) this.frog.x += this.frogSpeed;
  },

  lose: function () {
    this.ready = false;
    window.Score -= 100;
    this.TextManager.statusText("LOSE!");
    this.game.time.events.add(1000, this.end, this);
  },

  win: function () {
    this.ready = false;
    window.SpeedMultiplier += 0.5;
    window.Score += 100;
    this.TextManager.statusText("WIN!");
    this.game.time.events.add(1000, this.end, this);
  },

  end: function() {
    this.game.state.start('Game');
  }
};

module.exports = FrogGame;
