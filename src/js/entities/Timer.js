var Timer = function(game, baseTime, endCallback, ctx, reverse) {
  Phaser.Sprite.call(this, game, -6, game.height - 8, 'timer-animation');
  this.game = game;

  this.longer = reverse || false;

  this.baseTime = baseTime;
  this.timer = null;
  this.timerTime = baseTime - (window.SpeedMultiplier * 10);

  if (this.longer)
    this.timerTime += (window.SpeedMultiplier * 10) * 2;

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
  this.timer = this.game.time.events.add(this.timerTime, function() {});
};

Timer.prototype.setup = function() {
  this.x = -6;
  this.timerTime = this.baseTime - (window.SpeedMultiplier * 10);
  if (this.longer)
    this.timerTime += (window.SpeedMultiplier * 10) * 2;

  this.timeDestroyed = false;
  this.timerTween = this.game.add.tween(this).to({ x: this.game.width }, this.timerTime);
  if (typeof this.onTimerTweenComplete !== "undefined")
    this.timerTween.onComplete.add(this.onTimerTweenComplete.bind(this.context), this);
};

Timer.prototype.end = function() {
  this.timerDestroyed = true;
  this.game.tweens.remove(this.timerTween);
  this.game.time.events.remove(this.timer);

  this.setup();
};

module.exports = Timer;
