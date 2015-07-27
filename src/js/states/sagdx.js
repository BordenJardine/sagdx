var SAGDX = function () {
};

module.exports = SAGDX;

SAGDX.prototype = {
  create: function () {
    this.game.stage.backgroundColor = '#9CD4E6';

    var logoW = this.game.cache.getImage('SAGDX').width;
    var logoH = this.game.cache.getImage('SAGDX').height;

    var x = (this.game.width / 2) - (logoW / 2);
    var y = (this.game.height / 2) - (logoH / 2);

    this.game.add.sprite(x, y, 'SAGDX');

    this.input.onDown.add(this.onDown, this);
    this.timeout = this.game.time.events.add(3000, this.startGame, this);
  },

  update: function () {
  },

  onDown: function () {
    if (!this.game.device.desktop) {
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.startFullScreen(true);
    }

    this.startGame();
  },

  startGame: function() {
    this.game.state.start('Menu');
  }
};
