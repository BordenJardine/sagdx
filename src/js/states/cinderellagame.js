var CinderellaGame = function () {
};

CinderellaGame.prototype = {
  create: function () {
    var slipperW = this.game.cache.getImage('slipper').width;
    var slipperH = this.game.cache.getImage('slipper').height;
    this.input.onDown.add(this.onDown, this);
    this.game.add.sprite(0, 120, 'foot');
    this.slipper = this.game.add.sprite(this.game.width - slipperW, slipperH, 'slipper');
    this.movement = 2;
  },

  update: function () {
    this.slipper.y += this.movement;

    if (this.slipper.y > this.game.height - this.slipper.height)
      this.movement = -2;
    if (this.slipper.y < this.slipper.height)
      this.movement = 2;
  },

  onDown: function () {
    if (this.slipper.y > 280 && this.slipper.y < 300) {
      alert('WIN!');
      window.Score += 100;
    } else {
      alert('LOSE!');
      window.Score -= 100;
    }

    this.game.state.start('Game');
  }
};

module.exports = CinderellaGame;
