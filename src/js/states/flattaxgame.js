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

    this.bad = this.game.add.audio('bad');
    this.good = this.game.add.audio('good');

    this.Timer = new Timer(this.game, 5000 - (100 * window.SpeedModifier),
                           this.onTimerComplete, this, true);
    this.TextManager = new TextManager(this.game);
    this.game.plugins.add(new SwipeManager(this.game, this.swipe, this, true));
    this.segments = [];
    this.graphics = this.game.add.graphics(0, 0);
    this.graphics.lineStyle(3, 0x000000);

    this.game.add.sprite(0, 0, 'taxbg');
    var header = this.game.add.text(this.game.world.centerX, 20, "U.S. Tax Code", {
      font: '45px serif',
      fill: '#000000',
      align: 'center'
    });
    header.x -= (header.width / 2);
    var sub = this.game.add.text(this.game.world.centerX, 24 + header.height,
                                 "Fig 2.0.1, Marginal Tax Rate", {
      font: '24px serif',
      fill: '#000000',
      align: 'center'
    });
    sub.x -= (sub.width / 2);

    var segmentLength = this.game.width / NUM_SEGMENTS;
    var top = this.game.height / 1.5;
    var bot = this.game.height / 3;
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

    this.graphics.moveTo(this.segments[0].start.x, this.segments[0].start.y);

    this.inter = new Interstitial(this.game, "FLATTEN THE TAX", 1500, function() {
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
          var prevI = (slopeDir === 1) ? -1 : 1;
          var nextI = (slopeDir === 1) ? 1 : -1;

          var prev = this.segments[i + prevI];
          if (prev)
            prevSlope = this.findSlopeDirection(prev);
          var next = this.segments[i + nextI];
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
    this.graphics.clear();
    for (i = 0; i < this.segments.length; i++) {
      this.graphics.lineStyle(3, 0x000000);
      var seg = this.segments[i];
      var slope = this.findSlopeDirection(seg);
      var cpx1 = 0;
      var cpx2 = 0;
      var cpy1 = 0;
      var cpy2 = 0;
      var wDiff = seg.start.x - seg.end.x;
      var hDiff = Math.abs(seg.start.y - seg.end.y);
      this.graphics.moveTo(seg.start.x, seg.start.y);

      switch (slope) {
      case 0:
        cpx1 = seg.start.x + (wDiff / 3);
        cpx2 = seg.start.x + (wDiff / 3) * 2;
        cpy1 = seg.start.y;
        cpy2 = seg.start.y;
        break;
      case 1:
      case -1:
        cpx1 = seg.end.x;
        cpy1 = seg.start.y;
        cpx2 = seg.start.x;
        cpy2 = seg.end.y;
        break;
      }

      this.graphics.bezierCurveTo(cpx1,
                                  cpy1,
                                  cpx2,
                                  cpy2,
                                  seg.end.x,
                                  seg.end.y);
    }
  },

  onTimerComplete: function () {
    var lose = false;
    for (var i = 0; i < this.segments.length; i++) {
      if (!this.segments[i].leveled || this.segments[i].leveled === undefined) {
        lose = true;
        break;
      }
    }

    if (lose) this.lose();
    else this.win();
  },

  lose: function () {
    this.bad.play();
    this.ready = false;
    window.Score -= 100;
    window.Live -= 2;
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
    this.game.stage.backgroundColor = "#ffffff";
    this.game.state.start('Game');
  }
};

module.exports = FlatTaxGame;
