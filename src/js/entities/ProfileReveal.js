//This is a sprite that is displayed after the player chooses/rejects a profile
var ProfileReveal = function(game, x, y, profile) {
  Phaser.Sprite.call(this, game, x, y, profile.revealImage);

  this.profile = profile;

  var textArea = new Phaser.Sprite(game, 0, this.height, 'revealTextArea');

  var text = new Phaser.Text(game, 25, this.height + 25, profile.revealText);

  text.x = (textArea.width / 2) - (text.width / 2);
  text.y = textArea.y + (textArea.height / 2) - (text.height / 2);

  this.inputEnabled = true;

  if(!!profile.revealImage2) {
    setTimeout(loadSecondImage.bind(this), 700);
  }

  this.addChild(textArea);
  this.addChild(text);
};

var loadSecondImage = function() {
  if(this.game) this.loadTexture(this.profile.revealImage2);
};

ProfileReveal.prototype = Object.create(Phaser.Sprite.prototype);
ProfileReveal.prototype.constructor = ProfileReveal;

module.exports = ProfileReveal;
