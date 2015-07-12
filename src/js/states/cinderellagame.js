var TextManager = require('../utilities/TextManager.js');
var Interstitial = require('../entities/Interstitial.js');

var CinderellaGame = function () {
};

CinderellaGame.prototype = {
  create: function () {
    var slipperW = this.game.cache.getImage('slipper').width;
    var slipperH = this.game.cache.getImage('slipper').height;
    this.TextManager = new TextManager(this.game);
    this.input.onDown.add(this.onDown, this);
    this.game.add.sprite(0, 120, 'foot');
    this.slipper = this.game.add.sprite(this.game.width - slipperW, slipperH, 'slipper');
    this.movement = 2 * window.SpeedMultiplier;
    this.ready = false;

    var that = this;
    this.inter = new Interstitial(this.game, "GET THE FOOT", 4000, function() {
      this.inter.destroy();
      this.ready = true;
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

  onDown: function () {
    if (!this.ready)
      return;

    var text = null;
    if (this.slipper.y > 280 && this.slipper.y < 300) {
      window.SpeedMultiplier += 0.5;
      window.Score += 100;
      this.TextManager.statusText("WIN!");
    } else {
      window.Score -= 100;
      this.TextManager.statusText("LOSE!");
    }

    this.game.time.events.add(4000, this.end, this);
  },

  end: function() {
    this.game.state.start('Game');
  }
};

module.exports = CinderellaGame;
