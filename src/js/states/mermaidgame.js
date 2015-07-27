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
    this.game.stage.backgroundColor = '#327ed0';

    this.filter = new Phaser.Filter(this.game, null, waterShader);
    this.filter.setResolution(this.game.stage.width, this.game.stage.height);

    this.ready = false;
    this.clamReady = false;
    this.vuln = !this.clamReady;
    this.lost = false;
    this.attacked = false;

    this.clam = this.game.add.sprite(this.game.width / 3, this.game.height / 3, 'clam');
    this.clam.animations.add('shut');
    this.clam.animations.add('open', [3, 2, 1, 0]);

    this.attackers = [];
    this.fish = [];

    var fishCount = Math.floor((Math.random() * 4) + 1);
    for (var i = 0; i < fishCount; i++) {
      var yOffset = Math.floor((Math.random() * 150) + 50);
      var baseX = (i == 0 || i == 2) ? 64 : this.game.width - 100;
      var baseY = (i == 3 || i == 2) ? this.game.height - 64 - yOffset : 64 + yOffset;

      var fishTmp = this.game.add.sprite(baseX, baseY, 'fish');
      fishTmp.anchor.setTo(0.5, 1);
      fishTmp.animations.add('swim');
      fishTmp.animations.play('swim', 5, true);
      fishTmp.attacker = (Math.floor((Math.random() * 10) + 1)) > 7;
      fishTmp.facingLeft = (Math.floor((Math.random() * 2) + 1)) > 1;

      if (!fishTmp.facingLeft)
        fishTmp.scale.x = -1;

      if (this.attackers.length == 0 && i == fishCount - 1)
        fishTmp.attacker = true;

      if (fishTmp.attacker) {
        var countDown = this.gameTime -
              (Math.floor((Math.random() * (this.gameTime / 2)) + 1));
        fishTmp.time = countDown;
        fishTmp.attacked = false;
        this.attackers.push(fishTmp);
      }

      this.fish.push(fishTmp);
    }

    this.input.onDown.add(this.onDown, this);
    this.clamCooldown = 2000;
    this.clamDown = 750;

    this.inter = new Interstitial(this.game, "PROTECT THE CLAM", 1500, function() {
      this.inter.destroy();
      this.ready = true;
      this.clamReady = true;
      var filterSprite = this.game.add.sprite();
      filterSprite.width = this.game.stage.width;
	    filterSprite.height = this.game.stage.height;
      filterSprite.fixedToCamera = false;
	    filterSprite.filters = [ this.filter ];
      this.Timer = new Timer(this.game, this.gameTime, this.onTimerComplete, this, true);
      this.Timer.start();
    }, this);
  },

  update: function () {
    if (!this.ready)
      return;

    this.filter.update(this.game.input.activePointer);
    for (var i = 0; i < this.attackers.length; i++) {
      if (this.Timer.timer.timer.duration <= this.attackers[i].time &&
          this.Timer.timer.timer.duration != 0 &&
          !this.attackers[i].attacked) {
        this.attackers[i].attacked = true;

        if (this.attackers[i].x < this.clam.x &&
            this.attackers[i].facingLeft)
          this.attackers[i].scale.x = -1;
        else if (this.attackers[i].x > this.clam.x &&
                 !this.attackers[i].facingLeft)
          this.attackers[i].scale.x = 1;

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

    for (var i = 0; i < this.fish.length; i++) {
      if (!this.fish[i].attacked) {
      if (this.fish[i].x > this.game.width ||
          this.fish[i].x < 0) {
        this.fish[i].facingLeft = !this.fish[i].facingLeft;
        this.fish[i].scale.x *= -1;
      }

      var dir = 0.5;
      if (this.fish[i].facingLeft)
        dir *= -1;
      this.fish[i].x += dir;
      }
    }
  },

  onTimerComplete: function () {
    if (!this.lost)
      this.win();
    else
      this.lose();
  },

  lose: function () {
    this.ready = false;
    window.Score -= 100;
    window.Lives -= 2;
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
    this.game.stage.backgroundColor = '#ffffff';
    this.game.state.start('Game');
  }
};

module.exports = MermaidGame;

var waterShader = [
    "precision mediump float;",
    "uniform float     time;",
    "uniform vec2      resolution;",
    "uniform vec2      mouse;",
    "#define MAX_ITER 4",
    "void main( void )",
    "{",
        "vec2 v_texCoord = gl_FragCoord.xy / resolution;",
        "vec2 p =  v_texCoord * 8.0 - vec2(20.0);",
        "vec2 i = p;",
        "float c = 0.8;",
        "float inten = .03;",
        "for (int n = 0; n < MAX_ITER; n++)",
        "{",
            "float t = time * (1.0 - (3.0 / float(n+1)));",
            "i = p + vec2(cos(t - i.x) + sin(t + i.y),",
            "sin(t - i.y) + cos(t + i.x));",
            "c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),",
            "p.y / (cos(i.y+t)/inten)));",
        "}",
        "c /= float(MAX_ITER);",
        "c = 1.5 - sqrt(c);",
        "vec4 texColor = vec4(0.0, 0.01, 0.015, 0.2);",
        "texColor.rgb *= (1.0 / (1.0 - (c + 0.05)));",
        "gl_FragColor = texColor;",
    "}"
];
