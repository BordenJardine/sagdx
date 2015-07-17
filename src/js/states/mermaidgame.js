var TextManager = require('../utilities/TextManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');

var MermaidGame = function () {
};

MermaidGame.prototype = {
  create: function () {
    this.TextManager = new TextManager(this.game);
    this.Timer = null;

    this.lost = false;

    // clam / player sprite
    // random N of fish sprites

    // set up controls for shutting clam (onDown)
    // clam on down cooldown (1s?)

    this.inter = new Interstitial(this.game, "PROTECT THE CLAM", 3500, function() {
      this.inter.destroy();
      this.ready = true;
      this.Timer = new Timer(this.game, 2500, this.onTimerComplete, this);
      this.Timer.start();
    }, this);
  },

  update: function () {
    if (!this.ready)
      return;

    // random chance for one fish to charge
    // increases as timer durection increases (need at least one to charge)
  },

  onTimerComplete: function () {
    // if loss flag not set, win
    if (!this.lost)
      this.win();
    else
      this.lose();
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

  onDown: function () {
    if (!this.ready)
      return;
  },

  end: function() {
    this.game.state.start('Game');
  }
};

module.exports = MermaidGame;
