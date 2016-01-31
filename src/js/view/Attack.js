var Attack = function (game) {
    "use strict";
    Phaser.Group.call(this, game, null);
    this._gameRef = game;

    this.onHit = new Phaser.Signal();
};
module.exports = Attack;
Attack.prototype = Object.create(Phaser.Group.prototype);
Attack.prototype.constructor = Attack;

Attack.prototype.init = function(pos) {
    "use strict";
    this._sprite = new Phaser.Sprite(this._gameRef, 0, 0, "attack");
    this.addChild(this._sprite);
    this._sprite.anchor.setTo(0.5, 0.5);
    this._sprite.animations.add("attack",  [0, 1, 2, 3], 12, false);
    this._sprite.animations.play("attack");

    this._rekt = new Phaser.Rectangle(pos.x - 7, pos.y - 7, 14, 14);

    var hitTimer = this._gameRef.time.create(false);
    hitTimer.add(90, function () { this.onHit.dispatch(this._rekt, this); }, this);
    hitTimer.start();
};

