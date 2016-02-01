var MovementProperties = require("../components/MovementProperties");
var MovementController = require("../components/MovementController");

var FishBoss = function (game) {
    "use strict";
    Phaser.Group.call(this, game, null);
    this._gameRef = game;

    this._sprite = null;

    this._movementProperties = null;
    this._movementController = null;

    this._collisionPoints = null;
    this._tileMapCollider = null;

    this._animator = null;
    this._movingRight = true;
    this._moveTime = 0;
    this._maxMoveTimer =1.0;

    this.ID = -1;
    this.Health = 10;
    this.XP = 10;
    this.onDamage = new Phaser.Signal();

    this.Dead = false;
    this.onDeath = new Phaser.Signal();
    this.onDeathComplete = new Phaser.Signal();

    this._boxOffset = new Phaser.Point(-19, -13);
    this._hitBox = new Phaser.Rectangle(0, 0, 40, 36);
    this._hurtBox = new Phaser.Rectangle(0, 0, 40, 36);

    this._aiState = "chill";
    this._targetX = 0;
    this._targetY = 0;
    this._moveTime = 0;
    this._maxMoveTime = 2000;
};
module.exports = FishBoss;
FishBoss.prototype = Object.create(Phaser.Group.prototype);
FishBoss.prototype.constructor = FishBoss;

FishBoss.prototype.init = function () {
    "use strict";
    this._sprite = new Phaser.Sprite(this._gameRef, 0, 0, "fishboss");
    //this._sprite.anchor.setTo(0.53125, 0.53125);
    this._sprite.anchor.setTo(0.357, 0.575);
    this._sprite.animations.add("normal", [0], 6, false);
    this._sprite.animations.add("teeth", [1], 6, false);
    this._sprite.animations.play("normal");
    this.addChild(this._sprite);

    this._movementProperties = new MovementProperties();
    this._movementProperties.BaseSpeed = 10;

    this._pos = this._movementProperties.Position;
    this._pos.x = 300;
    this._pos.y = 100;
    this._velocity = this._movementProperties.Velocity;

    this._movementController = new MovementController();
    this._movementProperties.Fish = true;
};

FishBoss.prototype.processAI = function (dt, playerPos, waterLevel, playerUnderWater) {
    "use strict";

    if (this._aiState === "chill") {
            this._sprite.animations.play("normal");
        if (playerUnderWater && playerPos.y - waterLevel > 24) {
            this._aiState = "reposition";
            this._moveTime = 0;
            this._maxMoveTime = 0.85;
            this._velocity.x = 0;
            var actualY = this._pos.y + waterLevel;
            if (playerPos.y < actualY) {
                this._velocity.y = -70;
            }
            else {
                this._velocity.y = 70;
            }
            var diff = Math.abs(actualY - playerPos.y);
            this._maxMoveTime = Math.min(1.1, diff/45);
        }
        else {
            if (this._pos > 300) {
                this._aiState = "rising";
                this._moveTime = 0;
                this._maxMoveTime = 3;
                this._velocity.x = 0;
                this._velocity.y = -20;
            }
            else {
                this._aiState = "moving";
                this._moveTime = 0;
                this._maxMoveTime = 3;
                    this._velocity.y = 0;
                if (playerPos.x < this._pos.x) {
                    this._velocity.x = -40;
                }
                else {
                    this._velocity.x = 40;
                }
            }
        }
    }
    if (this._aiState === "moving" || this._aiState === "rising" ) {
        this._moveTime += dt;
        if (this._moveTime > this._maxMoveTime) {
            this._moveTime = 0;
            this._aiState = "chill";
        }
    }
    if (this._aiState === "reposition") {
        this._moveTime += dt;
        if (this._moveTime > this._maxMoveTime) {
            this._aiState = "chargeUp";
            this._moveTime = 0;
            this._maxMoveTime = 1;
            this._velocity.y = 0;
            if (playerPos.x < this._pos.x) {
                this._velocity.x = -1;
            }
            else {
                this._velocity.x = 1;
            }
            this._sprite.animations.play("teeth");
        }
    }
    else if (this._aiState === "chargeUp") {
        this._moveTime += dt;
        if (this._moveTime > this._maxMoveTime) {
            this._aiState = "charging";
            this._moveTime = 0;
            this._maxMoveTime = 1.25;
            this._velocity.y = 0;
            if (playerPos.x < this._pos.x) {
                this._velocity.x = -175;
            }
            else {
                this._velocity.x = 175;
            }
        }
    }
    else if (this._aiState === "charging") {
        this._moveTime += dt;
        if (this._moveTime > this._maxMoveTime) {
            this._aiState = "chill";
        }
    }

        
};

FishBoss.prototype.updateMovement = function (dt) {
    "use strict";
    this._movementController.update(this._movementProperties, dt);
};

FishBoss.prototype.updatePositions = function (waterLevel) {
    "use strict";
    this.x = this._pos.x;
    this.y = this._pos.y + waterLevel;
    this._hitBox.x = this.x  + this._boxOffset.x;
    this._hitBox.y = this.y  + this._boxOffset.y;
    this._hurtBox.x = this.x + this._boxOffset.x;
    this._hurtBox.y = this.y + this._boxOffset.y;

    if (this._velocity.x > 0) {
        this.scale.x = -1;
    }
    else if (this._velocity.x < 0) {
        this.scale.x = 1;
    }
};

FishBoss.prototype.doDamage = function (damage, playerPos) {
    "use strict";
    if (damage !== undefined) {
        this.HP -= damage;

        this.onDamage.dispatch(damage, this);

        if (this.HP <= 0) {
            this.Dead = true;
            this.onDeath.dispatch(this);
        }
    }
};
FishBoss.prototype.deathAnimation = function () {
    "use strict";
            this._sprite.animations.play("teeth");
    var deathTween = this._gameRef.add.tween(this);
    deathTween.to({alpha:0}, 5000, Phaser.Easing.Linear.None);
    deathTween.onComplete.add(function () { this.onDeathComplete.dispatch(); }, this);
    deathTween.start();
    this._deathX = this.x;
    this.shake();
};

FishBoss.prototype.shake = function () {
    "use strict";
    var leftTween = this._gameRef.add.tween(this);
    leftTween.to({x:this._deathX  - 2}, 25, Phaser.Easing.Linear.None);
    leftTween.to({x:this._deathX  + 2}, 25, Phaser.Easing.Linear.None);
    leftTween.onComplete.add(this.shake, this);
    leftTween.start();
};