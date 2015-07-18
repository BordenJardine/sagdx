var TextManager = function(game) {
  this.game = game;
  this.bonusTexts = [];
  this.floatingTexts = [];
};

TextManager.prototype.addFloatingText = function(text, dir, reason, x, y) {
  var startX = x || this.game.width / 2;
  var startY = y || this.game.height / 2;
  var direct = dir || "up";
  var target = 64;
  var textReason = null;

  if (direct === "down")
    target = this.game.height - 64;

  var textObj = this.game.add.text(startX, startY, text, { font: '40px Arial' });
  textObj.x -= (textObj.width / 2) + 16;

  if (typeof reason !== "undefined") {
    textReason = this.game.add.text(0, -16, reason, { font: '16px Arial' });
    textObj.addChild(textReason);
  }

  var tween = this.game.add.tween(textObj.scale)
        .to({ y: 1.2, x: 1.2 }, 200, Phaser.Easing.Linear.None, false, 200);
  tween.onComplete.add(function() {
    var tween2 = this.game.add.tween(textObj)
          .to({ y: target , alpha: 0 }, 1000, Phaser.Easing.Linear.None, false, 700);
    tween2.onComplete.add(function() {
      textObj.destroy();
    });
    tween2.start();
  }, this);
  tween.start();
};

TextManager.prototype.statusText = function(text) {
  var x = this.game.camera.x + this.game.width / 2;
  var y =  this.game.camera.y + this.game.height / 2;

  var bg = this.game.add.graphics(0, y - 36);
  bg.beginFill(0x000000, 1);
  bg.boundsPadding = 0;
  bg.drawRect(this.game.camera.x, 0, this.game.camera.x + this.game.width, 64);

  var textObj = this.game.add.text(x, y, text, { font: '40px Arial', fill: '#ffffff' });
  textObj.x -= (textObj.width / 2);
  textObj.y -= (textObj.height / 2);

  var flashTween = this.game.add.tween(textObj);
  flashTween.to({ visible: !textObj.visible } , 10, Phaser.Easing.Linear.None, true, 5, true, true);
  flashTween.start();
}

module.exports = TextManager;
