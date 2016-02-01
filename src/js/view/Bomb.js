var Bomb = function (game) {
    "use strict";
    Phaser.Group.call(this, game, null);
    this._gameRef = game;

    this.onHit = new Phaser.Signal();
};
module.exports = Bomb;
Bomb.prototype = Object.create(Phaser.Group.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.init = function(pos, dir) {
    "use strict";
    this._sprite = new Phaser.Sprite(this._gameRef, 0, 0, "bomb");
    this.addChild(this._sprite);
    this._sprite.anchor.setTo(0.5, 0.5);

    this._dir = -dir;
    this.velY = -100;
    this._rekt = new Phaser.Rectangle(this.x - 4, this.y - 4, 8, 8);
};

Bomb.prototype.updatePosition = function (dt) {
    "use strict";
    this.velY += 8.0;
    this.y += this.velY * dt;
    this.x += 50 * this._dir * dt;
    this._rekt.x = this.x - 4;
    this._rekt.y = this.y - 4;
};

Bomb.prototype.destroy = function () {
    "use strict";
    this._sprite.visible = false;
    this.dead = true;
};