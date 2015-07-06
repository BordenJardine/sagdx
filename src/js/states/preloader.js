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

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);

    window.CurrentProfileIdx = -1;
    window.CinderProfiles = this.shuffleProfiles();

    this.load.image('cinderLogo', assetRoot + 'cinder-logo.png');
    this.load.image('cinderFrame', assetRoot + 'cinder-frame.png');

    for (var i = 0; i < window.CinderProfiles.length; i++) {
      this.load.image(window.CinderProfiles[i].image, assetRoot + window.CinderProfiles[i].image);
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
