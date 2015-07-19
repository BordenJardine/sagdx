var SwipeManager = function(game, callback, receiver, verticalIncluded) {
  Phaser.Plugin.call(this, game);
  this.game = game;
  this.onCooldown = false;
  this.cooldown = 0;
  this.checkVert = verticalIncluded || false;
  this.onSwipe = callback.bind(receiver);
  this.swipeDirection = SwipeManager.SWIPE_DIRECTIONS.LEFT;
};

SwipeManager.prototype = Object.create(Phaser.Plugin.prototype);
SwipeManager.prototype.constructor = SwipeManager;

SwipeManager.prototype.update = function() {
  var start = this.game.input.activePointer.positionDown;
  var end = this.game.input.activePointer.position;

  var distance = Phaser.Point.distance(start, end);
  var duration = this.game.input.activePointer.duration;

  if (duration > 0 && !this.onCooldown) {
    if (distance > SwipeManager.SWIPE_DIST && duration < SwipeManager.SWIPE_TIME) {
      swipeDirection = end.x > start.x ? SwipeManager.SWIPE_DIRECTIONS.RIGHT :
        SwipeManager.SWIPE_DIRECTIONS.LEFT;

      if (this.checkVert) {
        var xDist = start.x - end.x;
        var yDist = start.y - end.y;
        if (Math.abs(yDist) > Math.abs(xDist))
          swipeDirection = end.y > start.y ? SwipeManager.SWIPE_DIRECTIONS.DOWN :
            SwipeManager.SWIPE_DIRECTIONS.UP;
      }

      this.onSwipe(swipeDirection);
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
SwipeManager.SWIPE_COOLDOWN = 50;
SwipeManager.SWIPE_DIRECTIONS = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3
};

module.exports = SwipeManager;
