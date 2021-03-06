'use strict';

var game = new Phaser.Game(414, 606, Phaser.AUTO, 'body');

window.TOTAL_GAMES = 9;

window.Utils = require('./utils');
window.Score = 0;
window.Lives = 8;
window.SpeedMultiplier = 1.0;
window.Games = 0;
window.PlayedGames = 0;

game.state.add('Boot', require('./states/boot'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('Splash', require('./states/splash'));
game.state.add('ClickMe', require('./states/clickme'));
game.state.add('warning', require('./states/warning'));
game.state.add('SAGDX', require('./states/sagdx'));
game.state.add('Menu', require('./states/menu'));
game.state.add('Instructions', require('./states/instructions'));
game.state.add('Game', require('./states/game'));
game.state.add('gameover', require('./states/gameover'));

game.state.add('CinderellaGame', require('./states/cinderellagame'));
game.state.add('FrogGame', require('./states/froggame'));
game.state.add('MermaidGame', require('./states/mermaidgame'));
game.state.add('DDRGame', require('./states/ddrgame'));
game.state.add('SnakeGame', require('./states/snakegame'));
game.state.add('CupGame', require('./states/cupgame'));
game.state.add('FlatTaxGame', require('./states/flattaxgame'));
game.state.add('ThisCatIsHorseShit', require('./states/thiscatishorseshit'));
game.state.add('GoldDiggerGame', require('./states/golddiggergame'));

game.state.start('Boot');
