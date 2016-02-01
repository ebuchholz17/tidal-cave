var MovementProperties = function () {
    "use strict";
    this.Position = new Phaser.Point();
    this.Velocity = new Phaser.Point();
    this.BaseSpeed = 0;
    this.OnGround = false;
    this.BumpedHead = false;
    this.UnderWater = false;
    this.Fish = false;
};
module.exports = MovementProperties;