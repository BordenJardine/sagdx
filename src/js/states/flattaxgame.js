var TextManager = require('../utilities/TextManager.js');
var SwipeManager = require('../utilities/SwipeManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');

var FlatTaxGame = function () {
};

NUM_SEGMENTS = 5;

FlatTaxGame.prototype = {
  create: function () {
    this.ready = false;
    this.Timer = new Timer(this.game, 6500, this.onTimerComplete, this, true);
    this.TextManager = new TextManager(this.game);
    this.game.plugins.add(new SwipeManager(this.game, this.swipe, this, true));
    this.segments = [];

    var segmentLength = this.game.width / NUM_SEGMENTS;
    var top = 10;
    var bot = this.game.height - 20;
    var level = (this.game.height / 2);
    var whereToGo = {
      0: top,
      1: level,
      2: bot
    };
    var start = { x: 0, y: whereToGo[Math.floor(Math.random() * 3)] };

    for (var i = 0; i < NUM_SEGMENTS; i++) {
      var end = {
        x: start.x + segmentLength,
        y: whereToGo[Math.floor(Math.random() * 3)]
      };
      var line = new Phaser.Line(start.x, start.y, end.x, end.y);
      this.segments.push(line);
      start = { x: end.x, y: end.y };
    }
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
      this.Timer.start();
      this.ready = true;
    }, this);
  },

  update: function () {
    if (!this.ready)
      return;
  },

  render: function() {
    for (var i = 0; i < this.segments.length; i++) {
      this.game.debug.geom(this.segments[i]);
    }
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
