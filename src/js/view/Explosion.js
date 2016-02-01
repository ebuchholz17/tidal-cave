var Explosion = function (game) {
    "use strict";
    Phaser.Group.call(this, game, null);
    this._gameRef = game;

    this.onHit = new Phaser.Signal();
};
module.exports = Explosion;
Explosion.prototype = Object.create(Phaser.Group.prototype);
Explosion.prototype.constructor = Explosion;

Explosion.prototype.init = function(pos) {
    "use strict";
    this._sprite = new Phaser.Sprite(this._gameRef, 0, 0, "explosion");
    this.addChild(this._sprite);
    this._sprite.anchor.setTo(0.5, 0.5);
    this._sprite.animations.add("Explosion",  [0, 1, 2, 3], 12, false);
    this._sprite.animations.play("Explosion");

    this._circle = new Phaser.Circle(pos.x, pos.y, 32);
    var hitTimer = this._gameRef.time.create(false);
    hitTimer.add(90, function () { this.onHit.dispatch(this._circle, this); }, this);
    hitTimer.start();

    var disappearTimer = this._gameRef.time.create(false);
    disappearTimer.add(200, function () { this.visible = false; }, this);
    disappearTimer.start();
};

