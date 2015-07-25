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
    var top = 40;
    var bot = this.game.height - 40;
    var level = (this.game.height / 2);
    var whereToGo = {
      0: top,
      1: level,
      2: bot
    };
    var start = { x: 0, y: whereToGo[Math.floor(Math.random() * 3)] };
    for (var i = 0; i < NUM_SEGMENTS; i++) {
      var endY = (start.y === top) ? level :
            (start.y === bot) ? level : whereToGo[Math.floor(Math.random() * 3)];
      var end = {
        x: start.x + segmentLength,
        y: endY
      };
      var line = new Phaser.Line(start.x, start.y, end.x, end.y);
      line.leveled = false;
      this.segments.push(line);
      if (line.start.y === line.end.y) line.leveled = true;
      start = { x: end.x, y: end.y };
    }

    this.inter = new Interstitial(this.game, "FLATTEN THE TAX", 4000, function() {
      this.inter.destroy();
      this.Timer.start();
      this.ready = true;
    }, this);
  },

  findSlopeDirection: function(line) {
    return (line.start.y < line.end.y) ? -1 :
      (line.start.y === line.end.y) ? 0 : 1;
  },

  flattenLine: function(line) {
    var slopeDir = this.findSlopeDirection(line);
    switch (slopeDir) {
    case 1:
      if (line.end.y >= (this.game.height / 2)) line.start.y = line.end.y;
      else line.end.y = line.start.y;
      break;
    case -1:
      if (line.end.y > (this.game.height / 2)) line.end.y = line.start.y;
      else line.start.y = line.end.y;
      break;
    case 0:
      return;
    }
  },

  swipe: function (dir, start, end) {
    var swipeLine = new Phaser.Line(start.x, start.y, end.x, end.y);
    for (var i = 0; i < this.segments.length; i++) {
      var seg = this.segments[i];
      var flatten = false;

      if (seg.leveled) continue;

      var int = swipeLine.intersects(seg, true);

      if (int) {
        console.log(int);
        if (int.y > (this.game.height / 2)) {
          if (dir !== 2) continue;
          flatten = true;
        }
        else if (int.y < (this.game.height / 2)) {
          if (dir !== 3) continue;
          flatten = true;
        }

        if (flatten) {
          var slopeDir = this.findSlopeDirection(seg);
          var nextSlope = 0;
          var prevSlope = 0;

          if (i !== 0) {
            var prev = this.segments[i - 1];
            if (prev)
                prevSlope = this.findSlopeDirection(prev);
            var next = this.segments[i + 1];
            if (next)
                nextSlope = this.findSlopeDirection(next);

            if (nextSlope != slopeDir && nextSlope != 0) {
                this.flattenLine(next);
                next.leveled = true;
            }
            else if (prevSlope != slopeDir && prevSlope != 0) {
                this.flattenLine(prev);
                prev.leveled = true;
            }
          }
          this.flattenLine(seg);
          seg.leveled = true;
        }
      }
    }
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
    var lose = true;
    for (var i = 0; i < this.segments.length; i++) {
      if (!this.segments[0].leveled) {
        lose = false;
        break;
      }
    }

    if (lose) this.lose();
    else this.win();
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

  end: function() {
    this.game.stage.backgroundColor = "#ffffff";
    this.game.state.start('Game');
  }
};

module.exports = FlatTaxGame;
