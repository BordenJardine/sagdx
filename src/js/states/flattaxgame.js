var TextManager = require('../utilities/TextManager.js');
var SwipeManager = require('../utilities/SwipeManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');

var FlatTaxGame = function () {
};


FlatTaxGame.prototype = {
  create: function () {
    this.ready = false;
    this.Timer = null;
    this.TextManager = new TextManager(this.game);
    this.game.plugins.add(new SwipeManager(this.game, this.swipe, this, true));

    // generate a curved line segment
    // detect swipes
    // on swipe, determine if intersected line segment
    // find first point of intersection, and compare the
    // y value of that point to the average y value of the
    // line
    // if its less than the average, and the swipe direction was up
    // then flatten the line somehow. and the reverse if it was down
    // and greater than the average

    this.inter = new Interstitial(this.game, "FLATTEN THE TAX", 4000, function() {
      this.inter.destroy();
      this.Timer = new Timer(this.game, 6500, this.onTimerComplete, this, true);
      this.Timer.start();
      this.ready = true;
    }, this);
  },

  update: function () {
    if (!this.ready)
      return;
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
  },

  end: function() {
    this.game.stage.backgroundColor = "#ffffff";
    this.game.state.start('Game');
  }
};

module.exports = FlatTaxGame;
