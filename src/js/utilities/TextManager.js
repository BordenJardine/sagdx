var TextManager = function(game, callback, receiver) {
  Phaser.Plugin.call(this, game);
  this.game = game;
};

TextManager.prototype = Object.create(Phaser.Plugin.prototype);
TextManager.prototype.constructor = TextManager;

module.exports = TextManager;
