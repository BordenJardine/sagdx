var TextManager = require('../utilities/TextManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');

var CUP_SWAPS = 4;
var CUP_X = 80;

var Cup = function(game, x, y, drugged) {
  Phaser.Sprite.call(this, game, x, y, 'cup');

  this.drugged = drugged;
}

Cup.prototype = Object.create(Phaser.Sprite.prototype);
Cup.prototype.constructor = Cup;

var CupGame = function () {
};

CupGame.prototype = {
  create: function () {
    var self = this;
    if (!this.game.device.desktop) this.input.onDown.add(this.goFullscreen, this);

    this.TextManager = new TextManager(this.game);


    this.ready = false;
    
    this.background = this.game.add.image(0, 0, 'cosbyBg');

    this.cups = this.game.add.group();
    for (var i = 0; i < 3; i++) {
      var cup = this.game.add.existing(new Cup(this.game, CUP_X, 20 + i * 120, false));
      this.cups.add(cup);
    }

    this.TimeUp = new Timer(this.game, 10000, this.onTimeUp, this);

    this.inter = new Interstitial(this.game, "CHUG A LUG", 1000, function() {
      this.inter.destroy();
      this.drugAnimation(function() {
        self.scrambleCups(CUP_SWAPS, function() {
          self.ready = true;
          self.TimeUp.start();
        });
      });

    }, this);

  },

  goFullscreen: function() {
    if (this.game.scale.isFullScreen) return;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.startFullScreen(true);
  },

  update: function() {
    if (!this.ready) return;
  },

  onTimeUp: function () {
    this.lose();
  },

  lose: function () {
    this.ready = false;
    window.Score -= 100;
    this.TextManager.statusText("LOSE!");
    this.game.time.events.add(2000, this.end, this);
  },

  win: function () {
    this.ready = false;
    window.SpeedMultiplier += 0.5;
    window.Score += 100;
    this.TextManager.statusText("WIN!");
    this.TimeUp.end();
    this.game.time.events.add(2000, this.end, this);
  },

  end: function() {
    this.game.state.start('Game');
    this.game.stage.backgroundColor = '#FFFFFF';
  },

  scrambleCups: function(swapsRemaining, callback) {
    var rands = [0, 0];

    while(rands[0] == rands[1]) {
      rands[0] = Math.floor(Math.random() * 3);
      rands[1] = Math.floor(Math.random() * 3);
    }

    rands.sort();
    
    this.swapCups(rands[0], rands[1], (function() {
      if(!swapsRemaining) {
        callback();
      } else {
        swapsRemaining -= 1;
        this.scrambleCups(swapsRemaining, callback);
      }
    }).bind(this));
  },

  swapCups: function(index1, index2, callback) {
    var cup1 = this.cups.children[index1];
    var cup2 = this.cups.children[index2];
    var yCoord = cup1.y + (cup2.y - cup1.y)
    var leftX = 0 - this.game.width / 3;
    var rightX = this.game.width - cup1.width + this.game.width / 3;

    var time = 200 + (500 / window.SpeedMultiplier);

    // tween the object down in a linear fashion
    this.game.add.tween(cup1).to({y: cup2.y }, time).start();
    this.game.add.tween(cup2).to({y: cup1.y }, time).start();

    var cup1Tween = this.game.add.tween(cup1)
      .to({x: leftX}, time * 0.5, Phaser.Easing.Sinusoidal.Out).start();

    cup1Tween.onComplete.add(function() {
      this.swapCupDisplayOrder(index1, index2);
      this.game.add.tween(cup1)
        .to({x: CUP_X}, time * 0.5, Phaser.Easing.Sinusoidal.In).start();
    }, this);

    var cup2Tween = this.game.add.tween(cup2)
      .to({x: rightX}, time / 2, Phaser.Easing.Sinusoidal.Out)
      .to({x: CUP_X}, time / 2, Phaser.Easing.Sinusoidal.In)
      .start();

    cup2Tween.onComplete.add(callback, this);
  },

  swapCupDisplayOrder: function(index1, index2) {
    var tmp = this.cups.children[index1];
    this.cups.children[index1] = this.cups.children[index2];
    this.cups.children[index2] = tmp;
  },

  drugAnimation: function(callback) {
    var pill = this.game.add.sprite(this.game.width / 2, -50, 'pill');
    pill.animations.add('flip');
    pill.animations.play('flip', 10, true);

    pillTween = this.game.add.tween(pill).to({y: this.cups.children[0].y + 50 }, 1000).start();
    pillTween.onComplete.add(callback, this);
  }
};

module.exports = CupGame;
