//This is a sprite that is displayed after the player chooses/rejects a profile
var ProfileReveal = function(game, x, y, profile) {
  Phaser.Sprite.call(this, game, x, y, profile.revealImage);

  var textArea = new Phaser.Sprite(game, 0, this.height, 'revealTextArea');
  var text = new Phaser.Text(game, 25, this.height + 25, profile.revealText);

  this.inputEnabled = true;

  this.addChild(textArea);
  this.addChild(text);
};

ProfileReveal.prototype = Object.create(Phaser.Sprite.prototype);
ProfileReveal.prototype.constructor = ProfileReveal;

module.exports = ProfileReveal;
