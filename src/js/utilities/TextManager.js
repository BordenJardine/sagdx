var TextManager = function(game) {
  this.game = game;
  this.bonusTexts = [];
  this.floatingTexts = [];
};

TextManager.prototype.addBonusText = function(text, x, y) {
};

TextManager.prototype.addFloatingText = function(text, dir, x, y) {
  var startX = x || this.game.width / 2;
  var startY = y || this.game.height / 2;
  var dir = dir || "up";
  var target = 64;

  if (dir === "down")
    target = this.game.height - 64;

  var textObj = this.game.add.text(startX, startY, text, { font: '40px Arial' });
  textObj.x -= (textObj.width / 2) + 16;

  var tween = this.game.add.tween(textObj.scale)
      .to({ y: 1.2, x: 1.2 }, 200, Phaser.Easing.Linear.None, false, 200)
  tween.onComplete.add(function() {
    var tween2 = this.game.add.tween(textObj)
        .to({ y: target , alpha: 0 }, 1000, Phaser.Easing.Linear.None, false, 700)
    tween2.onComplete.add(function() {
      textObj.destroy();
    })
    tween2.start();
  }, this);
  tween.start();
};

module.exports = TextManager;