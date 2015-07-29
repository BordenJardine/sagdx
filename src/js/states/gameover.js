var GameOver = function () {
};

module.exports = GameOver;

GameOver.prototype = {
  create: function () {
    this.game.stage.backgroundColor = '#ffffff';

    var endText = "GAME OVER!";
    var textProps = { font: '24pt Arial',
                      fill: '#C24300',
                      strokeThickness: 0 };

    var text = this.game.add.text(0, 0, endText, textProps);
    var scoreTitle = this.game.add.text(0, 0, "Final Score:", textProps);
    this.scoreText = this.game.add.text(0, 0, '1000', textProps);
    this.updateCnt = 0;
    this.counter = 0;
    this.scoreDone = false;

    text.x = (this.game.width / 2) - (text.width / 2);
    text.y = (this.game.height / 2) - (text.height / 2);
    scoreTitle.x = (this.game.width / 2) - (scoreTitle.width / 2);
    scoreTitle.y = text.y - 130;
    this.scoreText.x = (this.game.width / 2) - (this.scoreText.width / 2);
    this.scoreText.y = text.y - 100;

    this.input.onDown.add(this.onDown, this);
  },

  update: function () {
    if (!this.scoreDone) {
      this.updateCnt += 1;

      if (this.updateCnt % this.counter === 0)
        this.scoreText.setText(this.game.rnd.integerInRange(0, 5000));

      if (this.updateCnt % 20 === 0) this.counter++;
      if (this.counter >= 20) {
        this.scoreText.setText(0);
        this.scoreDone = true;
      }

      this.scoreText.x = (this.game.width / 2) - (this.scoreText.width / 2);
    }
  },

  reset: function() {
    window.Lives = 8;
    window.SpeedMultipler = 1;
    window.Games = 0;
    window.PlayedGames = 0;
    window.Score = 0;
  },

  onDown: function () {
    if (!this.scoreDone) return;
    this.reset();

    if (!this.game.device.desktop) {
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.startFullScreen(true);
    }

    this.restartGame();
  },

  restartGame: function() {
    if (this.game.device.desktop) {
      this.game.state.start('warning');
    } else {
      this.game.state.start('SAGDX');
    }
  }
};
