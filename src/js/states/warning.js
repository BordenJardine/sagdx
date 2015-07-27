var ClickMe = function () {
};

module.exports = ClickMe;

ClickMe.prototype = {
  create: function () {
    this.game.stage.backgroundColor = '#000000';

    var warning = "Warning";
    var warningProps = { font: '48pt Arial',
                      fill: '#C24300',
                      strokeThickness: 0 };

    var info = "this game is best enjoyed";
    var info2 = "on a smart phone";
    var infoProps = { font: '22pt Arial', fill: '#C24300', strokeThickness: 0 };

    var warningText = this.game.add.text(0, 0, warning, warningProps);
    var infoText = this.game.add.text(0, 0, info, infoProps);
    var info2Text = this.game.add.text(0, 0, info2, infoProps);

    warningText.x = (this.game.width / 2) - (warningText.width / 2);
    warningText.y = (this.game.height / 4) - (warningText.height / 2);

    infoText.x = (this.game.width / 2) - (infoText.width / 2);
    infoText.y = (this.game.height / 2) - (infoText.height / 2);

    info2Text.x = (this.game.width / 2) - (info2Text.width / 2);
    info2Text.y = (this.game.height / 1.8) - (info2Text.height / 2);

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
    this.game.state.start('SAGDX');
  }
};
