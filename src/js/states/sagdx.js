var Menu = function () {
};

module.exports = Menu;

Menu.prototype = {
  create: function () {
    this.game.stage.backgroundColor = '#9CD4E6';

    var cinderLogoW = this.game.cache.getImage('SAGDX').width;
    var cinderLogoH = this.game.cache.getImage('SAGDX').height;

    var x = (this.game.width / 2) - (cinderLogoW / 2);
    var y = (this.game.height / 2) - (cinderLogoH / 2);

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
