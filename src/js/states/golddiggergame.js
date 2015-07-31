var TextManager = require('../utilities/TextManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');
var SwipeManager = require('../utilities/SwipeManager.js');

var GoldDigger = function () {
};

GoldDigger.DIRECTIONS = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3
};
GoldDigger.REQUIRED_RATIO = 0.75;


GoldDigger.prototype = {
  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.SPEED = 105;

    this.yay = this.game.add.audio('yay');

    this.game.plugins.add(new SwipeManager(this.game, this.swipe, this, true));

    this.bad = this.game.add.audio('bad');
    this.good = this.game.add.audio('good');

    this.TextManager = new TextManager(this.game);
    this.Timer = null;

    this.game.add.sprite(0, 0, 'goldbg');

    this.player = this.game.add.sprite(this.game.width / 2,
                                       this.game.height / 2 - 16,
                                       'prospector');
    this.player.animations.add('default');
    this.player.animations.play('default', 5, true);
    this.player.direction = GoldDigger.DIRECTIONS.RIGHT;

    this.game.physics.enable(this.player);

    // do this for world boundries
    this.rects = this.game.add.group();

    // borders
    var leftrect = this.game.add.sprite(0, 0, null);
    this.game.physics.enable(leftrect);
    leftrect.body.setSize(50, this.game.height);
    leftrect.body.immovable = true;
    var trect = this.game.add.sprite(0, 0, null);
    this.game.physics.enable(trect);
    trect.body.setSize(this.game.width, 50);
    trect.body.immovable = true;
    var rightrect = this.game.add.sprite(this.game.width - 50, 50, null);
    this.game.physics.enable(rightrect);
    rightrect.body.setSize(this.game.width, this.game.height);
    rightrect.body.immovable = true;
    var brect = this.game.add.sprite(50, this.game.height - 50, null);
    this.game.physics.enable(brect);
    brect.body.setSize(this.game.width, 50);
    brect.body.immovable = true;

    // blocks
    var toprect = this.game.add.sprite(100, 100, null);
    this.game.physics.enable(toprect);
    toprect.body.setSize(110, 175);
    toprect.body.immovable = true;
    var trrect = this.game.add.sprite(245, 100, null);
    this.game.physics.enable(trrect);
    trrect.body.setSize(85, 175);
    trrect.body.immovable = true;
    var midr = this.game.add.sprite(110, 315, null);
    this.game.physics.enable(midr);
    midr.body.setSize(200, 65);
    midr.body.immovable = true;
    var botr = this.game.add.sprite(105, 430, null);
    this.game.physics.enable(botr);
    botr.body.setSize(210, 90);
    botr.body.immovable = true;

    this.rects.add(leftrect);
    this.rects.add(trect);
    this.rects.add(rightrect);
    this.rects.add(brect);
    this.rects.add(toprect);
    this.rects.add(midr);
    this.rects.add(botr);
    this.rects.add(trrect);

    this.coinsNeeded = this.totalCoins = this.game.rnd.integerInRange(5, 15);

    this.coins = this.game.add.group();
    this.coins.enableBody = true;
    this.coins.physicsBodyType = Phaser.Physics.Arcade;

    for (var i = 0; i < this.coinsNeeded; i++) {
        var c = this.coins.create(this.game.rnd.integerInRange(55, this.game.width - 55),
                                    this.game.rnd.integerInRange(55, this.game.height - 55),
                                    'gold',
                                  0);

      this.game.physics.enable(c);

      while(this.colliding(c)) {
        c.x = this.game.rnd.integerInRange(55, this.game.width - 55);
        c.y = this.game.rnd.integerInRange(55, this.game.height - 55);
      }

      c.name = 'coin' + i;
    }

    this.coins.callAll('animations.add', 'animations', 'default', [0, 1],
                       2, true);
    this.coins.callAll('animations.play', 'animations', 'default');


    this.ready = false;

    this.inter = new Interstitial(this.game, "OH HE'S A GOLD DIGGER", 1500, function() {
      this.inter.destroy();
      this.ready = true;
      this.Timer = new Timer(this.game, 15000, this.onTimerComplete, this);
      this.player.body.velocity.x = this.SPEED;
      this.Timer.start();
    }, this);
  },


  colliding: function(s) {
    var collides = false;
    var body = new Phaser.Rectangle(s.x, s.y, s.width, s.height);

    this.rects.forEach(function(rect) {
      var rectBounds = new Phaser.Rectangle(rect.x, rect.y, rect.body.width, rect.body.height);
      if (Phaser.Rectangle.intersects(rectBounds, body)) {
        collides = true;
        return;
      }
    });

    return collides;
  },

  handleCollide: function (a, b) {
    b.kill();
    this.yay.play();
    this.coinsNeeded += 1;
    switch(this.player.direction){
    case GoldDigger.DIRECTIONS.UP:
      this.player.body.velocity.y = -this.SPEED;
      break;
    case GoldDigger.DIRECTIONS.DOWN:
      this.player.body.velocity.y = this.SPEED;
      break;
    case GoldDigger.DIRECTIONS.RIGHT:
      this.player.body.velocity.x = this.SPEED;
      break;
    case GoldDigger.DIRECTIONS.LEFT:
      this.player.body.velocity.x = -this.SPEED;
      break;
    }
  },

  update: function () {
    if (!this.ready)
      return;


    this.game.physics.arcade.collide(this.player, this.coins, this.handleCollide, null, this);
    this.game.physics.arcade.collide(this.player, this.rects, function(){}, null, this);
  },

  onTimerComplete: function () {
    if (this.coinsNeeded >= GoldDigger.REQUIRED_RATIO * this.totalCoins) this.win();
    else this.lose();
  },

  swipe: function(dir) {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    switch(dir){
    case GoldDigger.DIRECTIONS.UP:
      this.player.body.velocity.y = -this.SPEED;
      this.player.direction = GoldDigger.DIRECTIONS.UP;
      break;
    case GoldDigger.DIRECTIONS.DOWN:
      this.player.body.velocity.y = this.SPEED;
      this.player.direction = GoldDigger.DIRECTIONS.DOWN;
      break;
    case GoldDigger.DIRECTIONS.RIGHT:
      this.player.body.velocity.x = this.SPEED;
      this.player.direction = GoldDigger.DIRECTIONS.RIGHT;
      break;
    case GoldDigger.DIRECTIONS.LEFT:
      this.player.body.velocity.x = -this.SPEED;
      this.player.direction = GoldDigger.DIRECTIONS.LEFT;
      break;
    }
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
