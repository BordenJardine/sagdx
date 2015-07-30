var Boot = function () {};

module.exports = Boot;

Boot.prototype = {

  preload: function () {
    this.load.image('preloader', 'assets/preloader.gif');
  },

  create: function () {
    this.game.input.maxPointers = 1;
    this.game.stage.backgroundColor = 0xffffff;

    if (!this.game.device.iPhone) {
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.pageAlignVertically = true;
    }

    if (!this.game.device.desktop) {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

      this.game.scale.minWidth =  260;
      this.game.scale.minHeight = 480;
      this.game.scale.maxWidth = 414;
      this.game.scale.maxHeight = 736;
    }

    this.game.scale.refresh();

    this.game.state.start('Preloader');
  }
};
