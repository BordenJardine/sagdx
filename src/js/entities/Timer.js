var Timer = function(game, baseTime, endCallback, ctx) {
  Phaser.Sprite.call(this, game, -6, game.height - 8, 'timer-animation');
  this.game = game;

  this.timerTime = baseTime - (window.SpeedMultiplier * 10);
  this.timeDestroyed = false;
  this.timerTween = null;

  this.onTimerTweenComplete = endCallback;
  this.context = ctx;

  this.setup();
  this.game.add.existing(this);
};

Timer.prototype = Object.create(Phaser.Sprite.prototype);
Timer.prototype.constructor = Timer;

Timer.prototype.start = function() {
  this.timerDestroyed = false;
  this.timerTween.start();
}

Timer.prototype.setup = function() {
  this.x = -6;
  this.timerTime = 2500 - (window.SpeedMultiplier * 10);
  this.timeDestroyed = false;
  this.timerTween = this.game.add.tween(this).to({ x: this.game.width }, this.timerTime);
  if (typeof this.onTimerTweenComplete !== "undefined")
    this.timerTween.onComplete.add(this.onTimerTweenComplete.bind(this.context), this);
}

Timer.prototype.end = function() {
  this.timerDestroyed = true;
  this.game.tweens.remove(this.timerTween);

  this.setup();
}

module.exports = Timer;
