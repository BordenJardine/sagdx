var CinderellaGame = function () {
};

CinderellaGame.prototype = {
  create: function () {
    this.input.onDown.add(this.onDown, this);
  },

  update: function () {
  },

  // TEMP
  onDown: function () {
    this.game.state.start('Game');
  }

};

module.exports = CinderellaGame;
