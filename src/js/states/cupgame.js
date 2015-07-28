var TextManager = require('../utilities/TextManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');

var BASE_CUP_SWAPS = 4;
var CUP_X = 100;

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
    var state = this;
    if (!this.game.device.desktop) this.input.onDown.add(this.goFullscreen, this);

    this.TextManager = new TextManager(this.game);

    this.bad = this.game.add.audio('bad');
    this.good = this.game.add.audio('good');

    this.ready = false;

    this.background = this.game.add.image(0, 0, 'cosbyBg');

    this.cups = this.game.add.group();
    for (var i = 0; i < 3; i++) {
      var cup = this.game.add.existing(new Cup(this.game, CUP_X, 20 + i * 120, false));
      this.cups.add(cup);
    }

    this.cupSwaps = BASE_CUP_SWAPS * Math.floor(window.SpeedMultiplier);

    this.TimeUp = new Timer(this.game, 10000, this.onTimeUp, this);

    this.inter = new Interstitial(this.game, "ZIP ZOP ZOOBITY BOP", 1500, function() {
      this.inter.destroy();

      this.drugCups(function() {
        state.scrambleCups(state.cupSwaps, function() {
          state.ready = true;
          state.TimeUp.start();
          state.cupSelection();
        });
      });

    }, this);

  },

  goFullscreen: function() {
    if (this.game.scale.isFullScreen) return;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.startFullScreen(true);
  },

  onTimeUp: function () {
    this.lose();
  },

  lose: function () {
    this.bad.play();
    this.ready = false;
    window.Score -= 100;
    window.Lives -= 2;
    this.TextManager.statusText("LOSE!");
    this.game.time.events.add(2000, this.end, this);
  },

  win: function () {
    this.good.play();
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
    var cupIndexes = this.twoRandomCupIndexes();
    
    this.swapCups(cupIndexes[0], cupIndexes[1], (function() {
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

  twoRandomCupIndexes: function() {
    var rands = [0, 0];

    while(rands[0] == rands[1]) {
      rands[0] = Math.floor(Math.random() * 3);
      rands[1] = Math.floor(Math.random() * 3);
    }

    rands.sort();

    return [rands[0], rands[1]];
  },

  swapCupDisplayOrder: function(index1, index2) {
    var tmp = this.cups.children[index1];
    this.cups.children[index1] = this.cups.children[index2];
    this.cups.children[index2] = tmp;
  },

  drugCups: function(callback) {
    var state = this;
    var indexes = this.twoRandomCupIndexes();
    var cup1 = this.cups.children[indexes[0]];
    var cup2 = this.cups.children[indexes[1]];

    this.drugAnimation(cup1, function() {
      state.drugAnimation(cup2, function() {
        callback();
      });
    });
  },

  drugAnimation: function(cup, callback) {
    var state = this;

    var pill = this.game.add.sprite(this.game.width / 2, -50, 'pill');
    pill.animations.add('flip');
    pill.animations.play('flip', 10, true);

    var pillTween = this.game.add.tween(pill).to({y: cup.y + 25 }, 500).start();
    pillTween.onComplete.add(function() {
      cup.drugged = true;
      this.splashAnimation(pill, callback);
    }, this);
  },

  splashAnimation: function(pill, callback) {
      var splash = this.game.add.sprite(0, 0, 'splash');

      splash.x = (pill.x + pill.width / 2) - splash.width / 2
      splash.y = (pill.y + pill.height / 2) - splash.height / 2

      var anim = splash.animations.add('splash');

      anim.onComplete.add(function() {
        splash.kill();
        callback();
      });

      anim.play(10);
      pill.kill();
  },

  cupSelection: function(){
    var state = this;
    var cups = this.cups.children;

    for(i in cups) {
      (function(cup) {
        cup.events.onInputDown.add(function() {
          if(!state.ready) return;
          if(cup.drugged) return state.lose();
          return state.win();
        }, state);

        cup.inputEnabled = true;
      })(cups[i]);
    }
  }
};

module.exports = CupGame;
