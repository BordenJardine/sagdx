var Instructions = function () {
};

module.exports = Instructions;

Instructions.prototype = {
  create: function () {
    this.game.stage.backgroundColor = '#ffffff';

    var text1 = "'Pass' or 'Like' the profiles Cinder suggests for you";
    var text2 = "Be careful, people tend to leave important information off of their profiles";

    var textProps = {
      font: '16pt Arial',
      fill: '#333333',
      wordWrap: true,
      wordWrapWidth: this.game.width - 30,
      align: 'center',
      strokeThickness: 0
    };

    var instructionsW = this.game.cache.getImage('instructions').width;
    var instructionsH = this.game.cache.getImage('instructions').height;

    var x = (this.game.width / 2) - (instructionsW / 2);
    var y = (this.game.height / 2) - (instructionsH / 2);

    this.game.add.sprite(x, y, 'instructions');

    var t1 = this.game.add.text(0, 25, text1, textProps);
    var t2 = this.game.add.text(0, 530, text2, textProps);

    t1.x = (this.game.width / 2) - (t1.width / 2);
    t2.x = (this.game.width / 2) - (t2.width / 2);

    this.input.onDown.add(this.onDown, this);
    this.timeout = this.game.time.events.add(10000, this.startGame, this);
  },

  update: function () {
  },

  startGame: function() {
    this.game.state.start('Game');
  },

  onDown: function () {
    if (!this.game.device.desktop) {
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.startFullScreen(true);
    }

    this.startGame();
  }
};
