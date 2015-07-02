var SwipeManager = require('../utilities/SwipeManager.js');

var Game = function () {
};

module.exports = Game;

Game.prototype = {
  create: function () {
    var x = (this.game.width / 2) - 100;
    var y = (this.game.height / 2);

    // TODO: (Random?) Image and profile

    this.SwipeManager = new SwipeManager(this.game, {}, this.onSwipe);
  },

  onSwipe() {
    console.log('swipe detected!');
  },

  update: function () {
    this.SwipeManager.update();
    var x, y, cx, cy, dx, dy, angle, scale;

    x = this.input.position.x;
    y = this.input.position.y;
    cx = this.world.centerX;
    cy = this.world.centerY;

    angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
    this.testentity.angle = angle;

    dx = x - cx;
    dy = y - cy;
    scale = Math.sqrt(dx * dx + dy * dy) / 100;

    this.testentity.scale.x = scale * 0.6;
    this.testentity.scale.y = scale * 0.6;
  },
};
