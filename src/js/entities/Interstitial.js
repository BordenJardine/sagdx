var Interstitial = function(game, instructs, timeout, callback, ctx) {
  Phaser.Group.call(this, game);
  this.game = game;
  this.ctx = ctx;
  this.callback = callback;

  this.updateTime = 0;

  var x = this.game.width / 2;
  var y = this.game.height / 2;

  this.blackout = game.add.graphics(0, 0);
  this.currentFill = 0x000000;
  this.blackout.beginFill(this.currentFill, 1);
  this.blackout.boundsPadding = 0;
  this.blackout.drawRect(0, 0, this.game.width, this.game.height);

  var match = this.game.add.image(0, 0, 'match');
  match.x = (this.game.width / 2) - (match.width / 2)
  match.y = (this.game.height / 4) - (match.height / 2)

  this.match = match;

  this.instruct = this.game.add.text(x, y, instructs, { fill: '#ffffff' });
  this.instruct.x -= (this.instruct.width / 2);
  this.instruct.y -= (this.instruct.height / 2);

  this.add(this.blackout);
  this.add(this.instruct);

  this.game.time.events.add(timeout, this.tearDown, this);
};

Interstitial.prototype = Object.create(Phaser.Group.prototype);
Interstitial.prototype.constructor = Interstitial;

Interstitial.prototype.update = function() {
  this.updateTime += 1;

  if (this.updateTime % 3 === 0) {
    // no XOR in JS...
    this.currentFill = !this.currentFill ? 0xFFFFFF : 0;
    var textFill = !this.currentFill ? '#FFFFFF' : '#000000';
    this.instruct.setStyle({'fill': textFill});
  }
};

Interstitial.prototype.tearDown = function() {
  this.match.kill();
  this.callback.call(this.ctx);
};

module.exports = Interstitial;
