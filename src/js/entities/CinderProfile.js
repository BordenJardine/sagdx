var CinderProfile = function(game, direction) {
  Phaser.Group.call(this, game);
  this.game = game;
  this.image = null;
  this.name = null;
  this.aboutText = null;
  this.selectionResult = null;
  this.generateProfile(direction);
};

CinderProfile.prototype = Object.create(Phaser.Group.prototype);
CinderProfile.prototype.constructor = CinderProfile;

CinderProfile.prototype.generateProfile = function(direction) {
  // Generate or randomly pick already generated image
  // Generate or randomly pick already generated profile text
  // Generate result of R/L swipes for this profile

  var width = this.game.width;
  var cinderFrameW = this.game.cache.getImage('cinderFrame').width;
  var cinderFrameH = this.game.cache.getImage('cinderFrame').height;
  var offset = (width - cinderFrameW) / 2;

  if (direction === 1)
    this.x = -width;
  else
    this.x = width * 2;

  this.image = this.create(offset, offset, 'cinderFrame');
  this.name = new Phaser.Text(this.game, offset, cinderFrameH + offset, "Ron");
  this.aboutText = new Phaser.Text(this.game,
                                   offset,
                                   this.name.y + this.name.height,
                                   "Hi, my name is Ron!", {
                                     font: '12px Arial'
                                   });
  this.add(this.aboutText);
  this.add(this.name);

  var tween = this.game.add.tween(this);
  tween.to({ x: 0 }, 500, Phaser.Easing.Cubic.Out, true);
  tween.start();
};

module.exports = CinderProfile;
