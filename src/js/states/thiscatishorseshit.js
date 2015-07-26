var TextManager = require('../utilities/TextManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');
var FLOOR_Y = 1080;

var Collidable = function(game, x, y, sprite, broken) {
  Phaser.Sprite.call(this, game, x, y, sprite);

  this.name = sprite;
  this.broken = broken;
}
Collidable.prototype = Object.create(Phaser.Sprite.prototype);
Collidable.prototype.constructor = Collidable;

var ThisCatIsHorseShit = function () {
};

ThisCatIsHorseShit.prototype = {
  create: function () {
    var self = this;

    if (!this.game.device.desktop) this.input.onDown.add(this.goFullscreen, this);

    this.background = this.game.add.image(0, 0, 'tchBackground');

    this.TextManager = new TextManager(this.game);
    this.Timer = null;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.cat = this.game.add.sprite(192, 330, 'cat');

    this.coatRack = this.game.add.existing(new Collidable(this.game, 53, 205, 'coatRack', false));
    this.bottle = this.game.add.existing(new Collidable(this.game, 255, 320, 'bottle', false));
    this.vase = this.game.add.existing(new Collidable(this.game, 361, 279, 'vase', false));

    this.collidables = [this.coatRack, this.vase, this.bottle];

    this.cat.animations.add('run');
    this.cat.animations.play('run', 10, true);

    this.ready = false;

    this.inter = new Interstitial(this.game, "THIS CAT IS HORSESHIT", 1000, function() {
      this.inter.destroy();
      this.ready = true;
      this.initGame();
      this.Timer = new Timer(this.game, 2500, this.onTimerComplete, this);
      this.Timer.start();
    }, this);
  },

  initGame: function() {
    this.game.physics.arcade.setBounds(0, 124, 414, 252);

    this.game.physics.enable(this.cat, Phaser.Physics.ARCADE);
    for(i in this.collidables) {
      var collidable = this.collidables[i];

      this.game.physics.enable(collidable, Phaser.Physics.ARCADE);
      collidable.body.immovable = true;
    }

    this.cat.body.velocity.setTo(300, 200);

    this.cat.body.collideWorldBounds = true;

    this.cat.body.bounce.set(1.0);
  },

  goFullscreen: function() {
    if(this.game.scale.isFullScreen) return;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.startFullScreen(true);
  },

  update: function() {
    if (!this.ready) return;

    for(i in this.collidables) {
      var collidable = this.collidables[i];
      this.game.physics.arcade.collide(this.cat, collidable, function() {
        collidable.broken = true;
        collidable.frame = 1;
      }, null, this);
    }

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
    this.game.time.events.add(2000, this.end, this);
  },

  end: function() {
    this.game.state.start('Game');
  }
};

module.exports = ThisCatIsHorseShit;
