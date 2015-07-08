var CinderProfile = function(game, direction) {
  Phaser.Group.call(this, game);
  this.game = game;
  this.profile = null;
  this.selectionResult = null;
  this.generateProfile(direction);
};

CinderProfile.prototype = Object.create(Phaser.Group.prototype);
CinderProfile.prototype.constructor = CinderProfile;

CinderProfile.prototype.generateProfile = function(direction) {
  // Generate or randomly pick already generated image
  // Generate or randomly pick already generated profile text
  // Generate result of R/L swipes for this profile

  window.CurrentProfileIdx += 1;
  if (window.CurrentProfileIdx === window.CinderProfiles.length)
    window.CurrentProfileIdx = 0;

  this.profile = window.CinderProfiles[window.CurrentProfileIdx];

  var width = this.game.width;
  var cinderFrameW = this.game.cache.getImage('cinderFrame').width;
  var cinderFrameH = this.game.cache.getImage('cinderFrame').height;
  var headerH = this.game.cache.getImage('header').height;
  var offsetX = (width - cinderFrameW) / 2;
  var offsetY = offsetX / 2;
  var textMargin = 25;

  if (direction === 1)
    this.x = -width;
  else
    this.x = width * 2;

  this.image = this.create(offsetX, headerH + offsetY, this.profile.image);
  this.frame = new Phaser.Sprite(this.game, 0, 0, 'cinderFrame');
  this.name = new Phaser.Text(this.game, textMargin, cinderFrameH - textMargin * 2, this.profile.name);

  this.image.addChild(this.frame);
  this.image.addChild(this.name);

  var tween = this.game.add.tween(this);
  tween.to({ x: 0 }, 500, Phaser.Easing.Cubic.Out, true);
  tween.start();
};

module.exports = CinderProfile;
