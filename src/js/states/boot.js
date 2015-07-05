var Boot = function () {};

module.exports = Boot;

Boot.prototype = {

  preload: function () {
    this.load.image('preloader', 'assets/preloader.gif');
  },

  create: function () {
    this.game.input.maxPointers = 1;
    this.game.stage.backgroundColor = 0xf6f6f2;

    if (this.game.device.desktop) {
      this.game.stage.scale.pageAlignHorizontally = true;
      this.game.stage.scale.pageAlignVertically = true;
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
      this.game.scale.screenScaleMode = Phaser.ScaleManager.EXACT_FIT;
      this.game.scale.startFullScreen(true);
      //this.game.scale.refresh();
    } else {
/*
      this.game.scale.minWidth =  260;
      this.game.scale.minHeight = 480;
      this.game.scale.maxWidth = 414;
      this.game.scale.maxHeight = 736;
*/
      this.game.scale.forcePortrait = true;
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
      this.game.scale.screenScaleMode = Phaser.ScaleManager.EXACT_FIT;
      this.game.scale.startFullScreen(true);
      this.game.scale.refresh();
    }

    this.game.state.start('Preloader');
  }
};
