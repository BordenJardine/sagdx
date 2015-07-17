var TextManager = require('../utilities/TextManager.js');
var Interstitial = require('../entities/Interstitial.js');
var Timer = require('../entities/Timer.js');

var MermaidGame = function () {
};

MermaidGame.prototype = {
  create: function () {
    this.gameTime = 4000;
    this.TextManager = new TextManager(this.game);
    this.Timer = null;

    this.ready = false;
    this.clamReady = false;
    this.vuln = !this.clamReady;
    this.lost = false;
    this.attacked = false;

    this.clam = this.game.add.sprite(this.game.width / 3, this.game.height / 3, 'clam');
    this.clam.animations.add('shut');
    this.clam.animations.add('open', [3, 2, 1, 0]);

    this.attackers = [];
    var fishCount = Math.floor((Math.random() * 4) + 1);
    for (var i = 0; i < fishCount; i++) {
      var fishTmp = this.game.add.sprite(1 + i * 100, 1 + i * 100, 'fish');
      fishTmp.animations.add('swim');
      fishTmp.animations.play('swim', 5, true);
      fishTmp.attacker = (Math.floor((Math.random() * 10) + 1)) > 7;

      if (this.attackers.length == 0 && i == fishCount - 1) fishTmp.attacker = true;

      var countDown = this.gameTime - (Math.floor((Math.random() * (this.gameTime / 2)) + 1));
      fishTmp.time = countDown;
      fishTmp.attacked = false;
      this.attackers.push(fishTmp);
    }

    this.input.onDown.add(this.onDown, this);
    this.clamCooldown = 2000;
    this.clamDown = 750;

    this.inter = new Interstitial(this.game, "PROTECT THE CLAM", 3500, function() {
      this.inter.destroy();
      this.ready = true;
      this.clamReady = true;
      this.Timer = new Timer(this.game, this.gameTime, this.onTimerComplete, this, true);
      this.Timer.start();
    }, this);
  },

  update: function () {
    if (!this.ready)
      return;

    for (var i = 0; i < this.attackers.length; i++) {
      if (this.Timer.timer.timer.duration <= this.attackers[i].time &&
          this.Timer.timer.timer.duration != 0 &&
          !this.attackers[i].attacked) {
        this.attackers[i].attacked = true;

        var tween = this.game.add.tween(this.attackers[i])
              .to({ x: this.clam.x + (this.clam.width / 2.5),
                    y: this.clam.y + (this.clam.height / 2) },
                  750,
                  Phaser.Easing.Linear.None,
                  false,
                  100)
              .start();
      }

      if (this.attackers[i].attacked) {
        var boundsClam = Phaser.Rectangle.inflate(this.clam.getBounds(), -70, -80);
        boundsClam.y += 20;
        boundsClam.x -= 25;
        var boundsAttacker = this.attackers[i].getBounds();

        if (Phaser.Rectangle.intersects(boundsClam, boundsAttacker)) {
          if (this.vuln) {
            this.lost = true;
          } else {
            var tmp = this.attackers[i];
            this.attackers.splice(i, 1);
            tmp.destroy();
          }
        }
      }
    }
  },

  onTimerComplete: function () {
    // if loss flag not set, win
    if (!this.lost)
      this.win();
    else
      this.lose();
  },

  lose: function () {
    this.ready = false;
    window.Score -= 100;
    this.TextManager.statusText("LOSE!");
    this.game.time.events.add(4000, this.end, this);
  },

  win: function () {
    this.ready = false;
    window.SpeedMultiplier += 0.5;
    window.Score += 100;
    this.TextManager.statusText("WIN!");
    this.game.time.events.add(4000, this.end, this);
  },

  onDown: function () {
    if (!this.ready || !this.clamReady)
      return;

    this.clam.animations.play('shut', 20);
    this.clamReady = false;
    this.vuln = false;
    this.game.time.events.add(this.clamCooldown, function() { this.clamReady = true; }.bind(this));
    this.game.time.events.add(this.clamDown,
                              function() {
                                this.clam.animations.play('open', 20);
                                this.vuln = true;
                              }.bind(this));
  },

  end: function() {
    this.game.state.start('Game');
  }
};

module.exports = MermaidGame;
