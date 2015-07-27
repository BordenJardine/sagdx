var ClickMe = function () {
};

module.exports = ClickMe;

ClickMe.prototype = {
  create: function () {
    this.game.stage.backgroundColor = '#ffffff';

    var startText = "Press to start!";
    var textProps = { font: '24pt Arial',
                      fill: '#C24300',
                      strokeThickness: 0 };

    var text = this.game.add.text(0, 0, startText, textProps);

    text.x = (this.game.width / 2) - (text.width / 2);
    text.y = (this.game.height / 2) - (text.height / 2);

    this.input.onDown.add(this.onDown, this);
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
    if (this.game.device.desktop) {
      this.game.state.start('warning');
    } else {
      this.game.state.start('SAGDX');
    }
  }
};
