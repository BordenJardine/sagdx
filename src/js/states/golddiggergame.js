var TextManager = require('../utilities/TextManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');
var SwipeManager = require('../utilities/SwipeManager.js');

var GoldDigger = function () {
};

GoldDigger.prototype = {
  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.plugins.add(new SwipeManager(this.game, this.swipe, this, true));

    this.bad = this.game.add.audio('bad');
    this.good = this.game.add.audio('good');

    this.TextManager = new TextManager(this.game);
    this.Timer = null;

    this.game.add.sprite(0, 0, 'goldbg');

    this.player = this.game.add.sprite(20, 20, 'prospector');
    this.game.physics.enable(this.player, Phaser.Physics.Arcade);

    this.coinsNeeded = this.game.rnd.integerInRange(5, 20);

    this.coins = this.game.add.group();
    this.coins.enableBody = true;
    this.coins.physicsBodyType = Phaser.Physics.Arcade;

    for (var i = 0; i < this.coinsNeeded; i++) {
      //var c = this.coins.create(0, 0, 'coin');
      //c.name = 'coin' + i;
      //c.body.immovable = true;
    }

    this.movement = 2.3 * window.SpeedMultiplier;
    this.ready = false;

    this.inter = new Interstitial(this.game, "OH HE'S A GOLD DIGGER", 1500, function() {
      this.inter.destroy();
      this.ready = true;
      this.Timer = new Timer(this.game, 7500, this.onTimerComplete, this);
      this.Timer.start();
    }, this);
  },


  handleCollide: function (a, b) {
    b.kill();
    this.coinsNeeded -= 1;
  },

  update: function () {
    if (!this.ready)
      return;

    this.game.physics.arcade.collide(this.player, this.group, this.handleCollide, null, this);
  },

  onTimerComplete: function () {
    if (this.coinsNeeded <= 0) this.win();
    else this.lose();
  },

  swipe: function(dir) {
    // change direction if possible
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

  end: function() {
    this.game.physics.destroy();
    this.game.state.start('Game');
  }
};

module.exports = GoldDigger;
