var CinderProfiles = require('../data/CinderProfiles.js');

var Preloader = function (game) {
  this.asset = null;
  this.ready = false;
};

module.exports = Preloader;

Preloader.prototype = {

  preload: function () {
    var assetRoot = 'assets/';

    this.asset = this.add.sprite(320, 240, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('cinderLogo', 'assets/cinder-logo.png');
    this.load.image('cinderFrame', 'assets/cinder-frame.png');
    this.load.image('nope', 'assets/NOPE.png');
    this.load.image('like', 'assets/like.png');
    this.load.image('header', 'assets/header.png');
    this.load.image('xButton', 'assets/x_button.png');
    this.load.image('heartButton', 'assets/heart_button.png');
    this.load.image('revealTextArea', 'assets/reveal_text_area.jpg');
    this.load.image('timer-animation', 'assets/timer-animation.png');
    this.game.load.spritesheet('timer-animation', 'assets/timer-animation.png', 32, 32);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);

    window.CurrentProfileIdx = -1;
    window.CinderProfiles = this.shuffleProfiles();

    this.load.image('cinderLogo', assetRoot + 'cinder-logo.png');
    this.load.image('cinderFrame', assetRoot + 'cinder-frame.png');

    for (var i = 0; i < window.CinderProfiles.length; i++) {
      var profile = window.CinderProfiles[i];
      this.load.image(profile.image, assetRoot + profile.image);
      this.load.image(profile.revealImage, assetRoot + profile.revealImage);
    }
  },

  shuffleProfiles: function() {
    var currentIdx = CinderProfiles.PROFILES.length, tmp, randomIdx;

    while (0 !== currentIdx) {
      randomIdx = Math.floor(Math.random() * currentIdx);
      currentIdx -= 1;

      tmp = CinderProfiles.PROFILES[currentIdx];
      CinderProfiles.PROFILES[currentIdx] = CinderProfiles.PROFILES[randomIdx];
      CinderProfiles.PROFILES[randomIdx] = tmp;
    }

    return CinderProfiles.PROFILES;
  },

  create: function () {
    this.asset.cropEnabled = false;
  },

  update: function () {
    if (!!this.ready) {
      this.game.state.start('Menu');
    }
  },

  onLoadComplete: function () {
    this.ready = true;
  }
};
