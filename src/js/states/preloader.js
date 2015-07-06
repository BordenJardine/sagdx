var Preloader = function (game) {
  this.asset = null;
  this.ready = false;
};

module.exports = Preloader;

Preloader.prototype = {

  preload: function () {
    this.asset = this.add.sprite(320, 240, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('cinderLogo', 'assets/cinder-logo.png');
    this.load.image('cinderFrame', 'assets/cinder-frame.png');
    this.load.image('ryan', 'assets/ryan.png');
    this.load.image('header', 'assets/header.png');
    this.load.image('twoButtons', 'assets/twobuttons.png');
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
