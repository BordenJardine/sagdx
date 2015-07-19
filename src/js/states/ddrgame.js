var TextManager = require('../utilities/TextManager.js');
var SwipeManager = require('../utilities/SwipeManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');

var DDRGame = function () {
};

DDRGame.prototype = {
  create: function () {
    this.ready = false;
    this.Timer = null;
    this.TextManager = new TextManager(this.game);

    this.game.plugins.add(new SwipeManager(this.game, this.swipe, this, true));

    var width = this.game.cache.getImage('up-arrow').width / 4;
    var height = this.game.cache.getImage('up-arrow').height;
    var padding = Math.floor((this.game.stage.width - (width * 2 + height * 2)) / 5);

    this.up = this.game.add.sprite(padding, this.topPadding, 'up-arrow');
    this.up.animations.add('blues');
    this.up.animations.play('blues', 10, true);
    this.down = this.game.add.sprite(padding * 2 + width, this.topPadding, 'down-arrow');
    this.down.animations.add('reds');
    this.down.animations.play('reds', 10, true);

    this.left = this.game.add.sprite(padding * 3 + width * 2, height / 2 - 20, 'left-arrow');
    this.left.animations.add('greens');
    this.left.animations.play('greens', 10, true);
    this.right = this.game.add.sprite(padding * 4 + width * 2 + height, height / 2 - 20, 'right-arrow');
    this.right.animations.add('oranges');
    this.right.animations.play('oranges', 10, true);

    this.arrowSpeed = 3 * window.SpeedMultiplier;
    this.arrows = [];
    this.arrowCooldown = 55;
    this.cooldown = 0;
    this.onCooldown = false;

    this.inter = new Interstitial(this.game, "DANCE OFF", 4000, function() {
      this.inter.destroy();
      this.Timer = new Timer(this.game, 6500, this.onTimerComplete, this, true);
      this.game.time.events.add(1500, function() {
        this.Timer.start();
      }, this);
      this.ready = true;
    }, this);
  },

  update: function () {
    if (!this.ready)
      return;

    var removeIdx = -1;

    for (var i = 0; i < this.arrows.length; i++) {
      var arrow = this.arrows[i];
      if (((arrow.dir === 3 || arrow.dir === 2) && arrow.y <= this.up.y) ||
          ((arrow.dir === 1 || arrow.dir == 0) && arrow.y <= this.right.y)) {
        removeIdx = i;
        arrow.destroy();
      }
      else
        arrow.y -= this.arrowSpeed;
    }

    if (removeIdx >= 0) this.arrows.splice(removeIdx, 1);

    if (this.arrowCooldown === this.cooldown) {
      this.onCooldown = false;
      this.cooldown = 0;
    }
    if (this.onCooldown)
      this.cooldown += 1;

    if (!this.onCooldown) {
      var spawn = Math.floor(Math.random() * 10) + 1 > 6;
      if (spawn) {
        var dir = Math.floor(Math.random() * 4);
        var arrow = null;

        switch(dir) {
        case 0:
          arrow = this.game.add.sprite(this.left.x, this.game.height + this.left.height, 'left-arrow');
          break;
        case 1:
          arrow = this.game.add.sprite(this.right.x, this.game.height + this.left.height, 'right-arrow');
          break;
        case 2:
          arrow = this.game.add.sprite(this.up.x, this.game.height + this.up.height, 'up-arrow');
          break;
        case 3:
          arrow = this.game.add.sprite(this.down.x, this.game.height + this.down.height, 'down-arrow');
          break;
        }

        arrow.animations.add('anim');
        arrow.animations.play('anim', 10, true);
        arrow.dir = dir;
        this.arrows.push(arrow);
        this.onCooldown = true;
      }
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
    var hit = false;

    for (var i = 0; i < this.arrows.length; i++) {
      var arrow = this.arrows[i];
      if (arrow.y <= this.up.y + this.up.height) {
        hit = true;
        if (arrow.dir === dir) {
          // add to score
          // special tween
        } else {
          // bad tween
        }
      }
    }

    if (!hit) {
      // subtract from score
      switch (dir) {
      case 0:
        this.game.add.tween(this.left.scale)
          .to({ x: 1.2, y: 1.2 }, 100, Phaser.Easing.Linear.None, true, 0, 0, true);
        break;
      case 1:
        this.game.add.tween(this.right.scale)
          .to({ x: 1.2, y: 1.2 }, 100, Phaser.Easing.Linear.None, true, 0, 0, true);
        break;
      case 2:
        this.game.add.tween(this.up.scale)
          .to({ x: 1.2, y: 1.2 }, 100, Phaser.Easing.Linear.None, true, 0, 0, true);
        break;
      case 3:
        this.game.add.tween(this.down.scale)
          .to({ x: 1.2, y: 1.2 }, 100, Phaser.Easing.Linear.None, true, 0, 0, true);
        break;
      }
    }
  },

  end: function() {
    this.game.state.start('Game');
  }
};

module.exports = DDRGame;
