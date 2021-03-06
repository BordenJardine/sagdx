var TextManager = require('../utilities/TextManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');

var CinderellaGame = function () {
};

CinderellaGame.prototype = {
  create: function () {
    var slipperW = this.game.cache.getImage('slipper').width;
    var slipperH = this.game.cache.getImage('slipper').height;

    this.bad = this.game.add.audio('bad');
    this.good = this.game.add.audio('good');

    this.TextManager = new TextManager(this.game);
    this.Timer = null;

    this.input.onDown.add(this.onDown, this);
    this.game.add.sprite(0, 120, 'foot');
    this.slipper = this.game.add.sprite(this.game.width - slipperW + 20, slipperH, 'slipper');
    this.movement = 2.3 * window.SpeedMultiplier;
    this.ready = false;

    var that = this;
    this.inter = new Interstitial(this.game, "GET THE FOOT", 1500, function() {
      this.inter.destroy();
      this.ready = true;
      this.Timer = new Timer(this.game, 2500, this.onTimerComplete, this);
      this.Timer.start();
    }, this);
  },

  update: function () {
    if (!this.ready)
      return;

    this.slipper.y += this.movement;

    if (this.slipper.y > this.game.height - this.slipper.height)
      this.movement *= -1;
    if (this.slipper.y < this.slipper.height)
      this.movement *= -1;
  },

  onTimerComplete: function () {
    this.lose();
  },

  lose: function () {
    this.bad.play();
    this.ready = false;
    window.Score -= 100;
    window.Lives -= 2;
    this.TextManager.statusText("LOSE!");
    this.game.time.events.add(4000, this.end, this);
  },

  win: function () {
    this.good.play();
    this.ready = false;
    window.SpeedMultiplier += 0.5;
    window.Score += 100;
    this.TextManager.statusText("WIN!");
    this.game.time.events.add(4000, this.end, this);
  },

  onDown: function () {
    if (!this.ready)
      return;

    this.Timer.end();

    this.slipper.x -= 20;
    if (this.slipper.y > 260 && this.slipper.y < 305) {
      this.win();
    } else {
      this.lose();
    }
  },

  end: function() {
    this.game.state.start('Game');
  }
};

module.exports = CinderellaGame;
