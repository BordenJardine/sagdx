var Menu = function () {
};

module.exports = Menu;

Menu.prototype = {
  create: function () {
    var cinderLogoW = this.game.cache.getImage('cinderLogo').width;
    var cinderLogoH = this.game.cache.getImage('cinderLogo').height;

    var x = (this.game.width / 2) - (cinderLogoW / 2);
    var y = (this.game.height / 3) - (cinderLogoH / 2);

    this.game.add.sprite(x, y, 'cinderLogo');

    this.input.onDown.add(this.onDown, this);
  },

  update: function () {
  },

  onDown: function () {
    this.game.state.start(playerState.currentLevel);
  }
};
