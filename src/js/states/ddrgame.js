var TextManager = require('../utilities/TextManager.js');
var SwipeManager = require('../utilities/SwipeManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');

var DDRGame = function () {
};

DDRGame.prototype = {
  create: function () {
    this.ready = false;
    this.Timer = null;
    this.TextManager = new TextManager(this.game);

    this.game.plugins.add(new SwipeManager(this.game, this.swipe, this, true));

    this.inter = new Interstitial(this.game, "DANCE OFF", 4000, function() {
      this.inter.destroy();
      this.ready = true;
      this.Timer = new Timer(this.game, 4500, this.onTimerComplete, this, true);
      this.Timer.start();
    }, this);
  },

  update: function () {
    if (!this.ready)
      return;

    // generate random arrow sprites
    // never more than one within 0.3s of each other
  },

  onTimerComplete: function () {
  },

  lose: function () {
    this.ready = false;
    window.Score -= 100;
    this.TextManager.statusText("LOSE!");
    this.game.time.events.add(4000, this.end, this);
  },

  win: function () {
    this.ready = false;
    window.SpeedMultiplier += 0.5;
    window.Score += 100;
    this.TextManager.statusText("WIN!");
    this.game.time.events.add(4000, this.end, this);
  },

  swipe: function (dir) {
    // go through current sprites
    // if one overlaps top bar, check its direction
    // if direction matchs swipe, do effect and
    // add points
  },

  end: function() {
    this.game.state.start('Game');
  }
};

module.exports = DDRGame;
