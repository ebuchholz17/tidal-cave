var NinjaStar = function (game) {
    "use strict";
    Phaser.Group.call(this, game, null);
    this._gameRef = game;

    this.onHit = new Phaser.Signal();
};
module.exports = NinjaStar;
NinjaStar.prototype = Object.create(Phaser.Group.prototype);
NinjaStar.prototype.constructor = NinjaStar;

NinjaStar.prototype.init = function(pos, dir) {
    "use strict";
    this._sprite = new Phaser.Sprite(this._gameRef, 0, 0, "ninjaStar");
    this.addChild(this._sprite);
    this._sprite.anchor.setTo(0.5, 0.5);
    this._sprite.animations.add("attack",  [0, 1], 20, true);
    this._sprite.animations.play("attack");

    this._dir = -dir;

    this._rekt = new Phaser.Rectangle(this.x - 4, this.y - 4, 8, 8);

    var hitTimer = this._gameRef.time.create(false);
    hitTimer.add(1000, this.destroy, this);
    hitTimer.start();
};

NinjaStar.prototype.updatePosition = function (dt) {
    "use strict";
    this.x += 100 * this._dir * dt;
    this._rekt.x = this.x - 4;
    this._rekt.y = this.y - 4;
};

NinjaStar.prototype.destroy = function () {
    "use strict";
    this._sprite.visible = false;
    this.dead = true;
};