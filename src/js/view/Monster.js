var MovementProperties = require("../components/MovementProperties");
var MovementController = require("../components/MovementController");
var CollisionPoints = require("../components/CollisionPoints");
var TileMapCollider = require("../components/TileMapCollider");

var Monster = function (game) {
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

    this._boxOffset = new Phaser.Point(-6, 0);
    this._hitBox = new Phaser.Rectangle(0, 0, 14, 8);
    this._hurtBox = new Phaser.Rectangle(0, 0, 14, 8);
};
module.exports = Monster;
Monster.prototype = Object.create(Phaser.Group.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.init = function (sprite) {
    "use strict";
    this._sprite = new Phaser.Sprite(this._gameRef, 0, 0, sprite);
    //this._sprite.anchor.setTo(0.53125, 0.53125);
    this._sprite.anchor.setTo(0.5, 0.5);
    this._sprite.animations.add("walking", [1, 0], 6, true);
    this._sprite.animations.play("walking");
    this.addChild(this._sprite);

    this._movementProperties = new MovementProperties();
    this._movementProperties.BaseSpeed = 10;
    this._movementProperties.OnGround = true;

    this._pos = this._movementProperties.Position;
    this._pos.x = 248;
    this._pos.y = 136;
    this._velocity = this._movementProperties.Velocity;

    this._movementController = new MovementController();
    this._collisionPoints = new CollisionPoints();
    this._collisionPoints.Left.push(new Phaser.Point(-4, 5));
    this._collisionPoints.Right.push(new Phaser.Point(3, 5));
    this._collisionPoints.Bottom.push(new Phaser.Point(-3, 9));
    this._collisionPoints.Bottom.push(new Phaser.Point(2, 9));
    this._tileMapCollider = new TileMapCollider();
};

Monster.prototype.processAI = function (dt) {
    "use strict";
    if (this._movementProperties.OnGround) {   
        if (this._movingRight) {
            this._velocity.x = 10.0;
            this.scale.x = -1;
        }
        else {
            this._velocity.x = -10.0;
            this.scale.x = 1;
        }
        this._moveTime += dt;
        if (this._moveTime > this._maxMoveTimer) {
            this._movingRight = !this._movingRight;
            this._moveTime -= this._maxMoveTimer;
        }
    }
        
};

Monster.prototype.updateMovement = function (dt) {
    "use strict";


    this._movementController.update(this._movementProperties, dt);

    this.x = this._pos.x;
    this.y = this._pos.y;
    this._hitBox.x = this.x  + this._boxOffset.x;
    this._hitBox.y = this.y  + this._boxOffset.y;
    this._hurtBox.x = this.x + this._boxOffset.x;
    this._hurtBox.y = this.y + this._boxOffset.y;
};

Monster.prototype.checkMapCollisions = function (tileMapModel) {
    "use strict";
    this._tileMapCollider.checkTileCollisions(tileMapModel, this._collisionPoints, this._movementProperties);

    this.x = this._pos.x;
    this.y = this._pos.y;
    this._hitBox.x = this.x + this._boxOffset.x;
    this._hitBox.y = this.y + this._boxOffset.y;
    this._hurtBox.x = this.x + this._boxOffset.x;
    this._hurtBox.y = this.y + this._boxOffset.y;
};

Monster.prototype.doDamage = function (damage, playerPos) {
    "use strict";
    if (damage !== undefined) {
        this.HP -= damage;

        this.onDamage.dispatch(damage, this);

        if (this.HP <= 0) {
            this.Dead = true;
            this.onDeath.dispatch(this);
        }
    }

    this._velocity.y = -75;
    this._movementProperties.OnGround = false;
    if (playerPos.x > this.x) {
        this._velocity.x = -75;
    }
    else {
        this._velocity.x = 75;
    }
};
Monster.prototype.deathAnimation = function () {
    "use strict";
    var deathTween = this._gameRef.add.tween(this);
    deathTween.to({alpha:0}, 500, Phaser.Easing.Linear.None);
    deathTween.start();
};