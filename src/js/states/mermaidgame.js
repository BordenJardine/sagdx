var TextManager = require('../utilities/TextManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');

var MermaidGame = function () {
};

MermaidGame.prototype = {
  create: function () {
    this.TextManager = new TextManager(this.game);
    this.Timer = null;

    this.ready = false;
    this.clamReady = false;
    this.vuln = !this.clamReady;
    this.lost = false;

    this.clam = this.game.add.sprite(this.game.width / 3, this.game.height / 3, 'clam');
    this.clam.animations.add('shut');
    this.clam.animations.add('open', [3, 2, 1, 0]);

    // random N of fish sprites

    this.input.onDown.add(this.onDown, this);
    this.clamCooldown = 2000;
    this.clamDown = 750;

    this.inter = new Interstitial(this.game, "PROTECT THE CLAM", 3500, function() {
      this.inter.destroy();
      this.ready = true;
      this.clamReady = true;
      this.Timer = new Timer(this.game, 2500, this.onTimerComplete, this, true);
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
    game.time.events.add(4000, this.end, this);
  },

  win: function () {
    this.ready = false;
    window.SpeedMultiplier += 0.5;
    window.Score += 100;
    this.TextManager.statusText("WIN!");
    this.game.time.events.add(4000, this.end, this);
  },

  onDown: function () {
    if (!this.ready || !this.clamReady)
      return;

    this.clam.animations.play('shut', 20);
    this.clamReady = false;
    this.vuln = false;
    this.game.time.events.add(this.clamCooldown, function() { this.clamReady = true; }.bind(this));
    this.game.time.events.add(this.clamDown,
                              function() {
                                this.clam.animations.play('open', 20);
                                this.vuln = true;
                              }.bind(this));
  },

  end: function() {
    this.game.state.start('Game');
  }
};

module.exports = MermaidGame;
