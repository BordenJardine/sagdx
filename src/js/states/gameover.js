var GameOver = function () {
};

module.exports = GameOver;

GameOver.prototype = {
  create: function () {

    this.tada = this.game.add.audio('tada');
    this.game.stage.backgroundColor = '#ffffff';
    this.emitter = null;

    var endText = "GAME OVER!";
    var textProps = { font: '24pt Arial',
                      fill: '#C24300',
                      strokeThickness: 0 };
    var textPropsScore = {
      font: '24pt Arial',
      fill: '#000000',
      strokeThickness: 0
    };
    var flavorProps = {
      font: '20px Arial',
      fill: '#000000',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.game.width - 30
    };

    var text = this.game.add.text(0, 0, endText, textProps);
    var scoreTitle = this.game.add.text(0, 0, "Final Score:", textPropsScore);
    this.scoreText = this.game.add.text(0, 0, '1000', textPropsScore);
    this.updateCnt = 0;
    this.counter = 0;
    this.scoreDone = false;

    text.x = (this.game.width / 2) - (text.width / 2);
    text.y = (this.game.height / 2) - (text.height / 2);
    scoreTitle.x = (this.game.width / 2) - (scoreTitle.width / 2);
    scoreTitle.y = text.y + 50;
    this.scoreText.x = (this.game.width / 2) - (this.scoreText.width / 2);
    this.scoreText.y = text.y + 80;

    var flavorText = null;
    if (window.PlayedGames >= window.TOTAL_GAMES) {
      flavorText = "Wow, you played all of the games. That's it I guess.";
    } else if (window.Games >= window.TOTAL_GAMES) {
      flavorText = "Wow, you couldn't even play through all of the games, and you expect" +
        " a reward or something?";
    }
    else {
      flavorText = "You're a loser.";
    }

    var flavor = this.game.add.text(0, 0, flavorText, flavorProps);
    flavor.x = (this.game.width / 2) - (flavor.width / 2);
    flavor.y = text.y - 200;

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
        this.scoreText.x = (this.game.width / 2) - (this.scoreText.width / 2);
        this.emitter = this.game.add.emitter(this.scoreText.x + (this.scoreText.width / 2),
                                             this.scoreText.y + (this.scoreText.height / 2),
                                             100);
        this.emitter.makeParticles('spark');
        this.emitter.start(false, 1500, 75);
        this.scoreDone = true;
        this.tada.play();
      }

      this.scoreText.x = (this.game.width / 2) - (this.scoreText.width / 2);
    }
  },

  reset: function() {
    window.Lives = 8;
    window.SpeedMultiplier = 1;
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
