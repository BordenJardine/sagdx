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
    this.load.image('foot', 'assets/foot.png');
    this.load.image('slipper', 'assets/slipper.png');

    this.load.image('frogHaus', 'assets/froghaus_color.jpg');
    this.load.spritesheet('frogPlayer', 'assets/naked_runner.png', 160, 190, 3);
    this.load.spritesheet('frogChaser', 'assets/frogrun.png', 152, 189, 4);
    this.load.spritesheet('leftShoe', 'assets/left_shoe.png', 48, 110, 3);
    this.load.spritesheet('rightShoe', 'assets/right_shoe.png', 48, 110, 3);

    this.load.image('snakeBite', 'assets/snake_bite.png');
    this.load.spritesheet('snake', 'assets/snake_sprite.png', 173, 416, 2);
    this.load.spritesheet('condom', 'assets/condom_sprite.png', 208, 499, 4);

    this.load.spritesheet('clam', 'assets/clam.png', 202, 215, 4);
    this.load.spritesheet('fish', 'assets/fish.png', 75, 50, 4);

    this.load.spritesheet('up-arrow', 'assets/up-arrow.png', 50, 90, 4);
    this.load.spritesheet('down-arrow', 'assets/down-arrow.png', 50, 90, 4);
    this.load.spritesheet('right-arrow', 'assets/right-arrow.png', 90, 50, 4);
    this.load.spritesheet('left-arrow', 'assets/left-arrow.png', 90, 50, 4);

    this.game.load.audio('good', 'assets/sounds/good.wav');
    this.game.load.audio('bad', 'assets/sounds/bad.wav');

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
      if(!!profile.revealImage2) this.load.image(profile.revealImage2, assetRoot + profile.revealImage2);
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
