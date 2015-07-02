var SwipeManager = function(game, bounds, callback) {
  Phaser.Plugin.call(this, game);
  this.game = game;
  this.bounds = bounds;
  this.onCooldown = false;
  this.cooldown = 0;
  this.onSwipe = callback;
};

SwipeManager.prototype = Object.create(Phaser.Plugin.prototype);
SwipeManager.prototype.constructor = SwipeManager;

SwipeManager.prototype.update = function() {
  // TODO: Ensure majority of swipe falls within this.bounds (?)
  var start = this.game.input.activePointer.positionDown;
  var end = this.game.input.activePointer.position;

  var distance = Phaser.Point.distance(start, end);
  var duration = this.game.input.activePointer.duration;

  if (duration > 0 && !this.onCooldown) {
    if (distance > SwipeManager.SWIPE_DIST && duration < SwipeManager.SWIPE_TIME) {
      this.onSwipe();
      this.onCooldown = true;
    }
  }

  if (this.onCooldown) {
    this.cooldown += 1;

    if (this.cooldown >= SwipeManager.SWIPE_COOLDOWN) {
      this.cooldown = 0;
      this.onCooldown = false;
    }
  }
};

SwipeManager.SWIPE_TIME = 250;
SwipeManager.SWIPE_DIST = 100;
SwipeManager.SWIPE_COOLDOWN = 25;

module.exports = SwipeManager;
