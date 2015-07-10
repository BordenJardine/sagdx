var Interstitial = function(game, instructs, timeout, callback, ctx) {
  Phaser.Group.call(this, game);
  this.game = game;
  this.ctx = ctx;
  this.callback = callback;

  var x = this.game.width / 2;
  var y = this.game.height / 2;

  var blackout = game.add.graphics(0, 0);
  blackout.beginFill(0x000000, 1);
  blackout.boundsPadding = 0;
  blackout.drawRect(0, 0, this.game.width, this.game.height);

  this.instruct = this.game.add.text(x, y, instructs, { font: '40px Arial', fill: '#ffffff' });
  this.instruct.x -= (this.instruct.width / 2);
  this.instruct.y -= (this.instruct.height / 2);

  this.add(blackout);
  this.add(this.instruct);

  this.game.time.events.add(timeout, this.tearDown, this);
};

Interstitial.prototype = Object.create(Phaser.Group.prototype);
Interstitial.prototype.constructor = Interstitial;

Interstitial.prototype.update = function() {
  // todo - flash instructions text or something
};

Interstitial.prototype.tearDown = function() {
  this.callback.call(this.ctx);
};

module.exports = Interstitial;
