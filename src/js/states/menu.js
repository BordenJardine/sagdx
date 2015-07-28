var Menu = function () {
};

module.exports = Menu;

Menu.prototype = {
  create: function () {
    this.game.stage.backgroundColor = '#ffffff';

    var startText = "Press to start!";
    var textProps = { font: '24pt Arial',
                      fill: '#C24300',
                      strokeThickness: 0 };

    var cinderLogoW = this.game.cache.getImage('cinderLogo').width;
    var cinderLogoH = this.game.cache.getImage('cinderLogo').height;

    var x = (this.game.width / 2) - (cinderLogoW / 2);
    var y = (this.game.height / 3) - (cinderLogoH / 2);

    this.game.add.sprite(x, y, 'cinderLogo');
    this.game.add.text(x, y + cinderLogoH * 1.5, startText, textProps);

    this.input.onDown.add(this.onDown, this);
  },

  update: function () {
  },

  onDown: function () {
    if (!this.game.device.desktop) {
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.startFullScreen(true);
    }

    this.game.state.start('Game');
  }
};
