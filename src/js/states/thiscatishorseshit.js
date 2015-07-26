var TextManager = require('../utilities/TextManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');
var BASE_CAT_X_VEL = 150;
var BASE_CAT_Y_VEL = 50;

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
      this.Timer = new Timer(this.game, 2500, this.onTimeUp, this);
      this.Timer.start();
    }, this);
  },

  initGame: function() {
    this.game.physics.arcade.setBounds(0, 154, 414, 222);

    this.game.physics.enable(this.cat, Phaser.Physics.ARCADE);

    this.initCollidables();
    this.initCat();

  },

  initCollidables: function() {
    for (i in this.collidables) {
      var collidable = this.collidables[i];

      this.game.physics.enable(collidable, Phaser.Physics.ARCADE);
      collidable.body.immovable = true;

      collidable.events.onInputDown.add(this.onClickCollidable , this);
      collidable.inputEnabled = true;
    }
  },

  initCat: function() {
    var randX = Math.floor(Math.random() * 50);
    var randY = Math.floor(Math.random() * 50);
    var randXSign = (Math.random() > .5) ? 1 : -1;
    var randYSign = (Math.random() > .5) ? 1 : -1;

    var speedModifier = ((window.SpeedMultiplier - 1) / 2) + 1

    var velX = (BASE_CAT_X_VEL + randX + speedModifier) * randXSign;
    var velY = (BASE_CAT_Y_VEL + randY + speedModifier) * randYSign;

    this.cat.body.velocity.setTo(velX, velY);

    this.cat.body.collideWorldBounds = true;

    this.cat.body.bounce.set(1.0);
  },

  onClickCollidable: function(collidable) {
    if (this.ready) {
      collidable.broken = false;
      collidable.frame = 0;
    }
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
      this.game.physics.arcade.overlap(this.cat, collidable, function() {
        collidable.broken = true;
        collidable.frame = 1;
      }, null, this);
    }
  },

  onTimeUp: function() {
    var brokenItems = 0;

    this.cat.body.velocity.setTo(0,0);

    for (i in this.collidables) {
      if(this.collidables[i].broken) return this.lose();
    }

    this.win();
  },

  lose: function() {
    this.ready = false;
    window.Score -= 100;
    this.TextManager.statusText("LOSE!");
    this.game.time.events.add(2000, this.end, this);
  },

  win: function() {
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
