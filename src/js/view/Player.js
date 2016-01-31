var MovementProperties = require("../components/MovementProperties");
var MovementController = require("../components/MovementController");
var CollisionPoints = require("../components/CollisionPoints");
var TileMapCollider = require("../components/TileMapCollider");
var PlayerAnimator = require("../components/PlayerAnimator")

var Player = function (game) {
    "use strict";
    Phaser.Group.call(this, game, null);
    this._gameRef = game;

    this._sprite = null;

    this._movementProperties = null;
    this._movementController = null;

    this._collisionPoints = null;
    this._tileMapCollider = null;

    this._jumping = false;
    this._jumpControl = false;
    this._jumpTime = 0;
    this._maxJumpTIme = 0.25;
    this._maxSpeed = 72;

    this._animator = null;
    this._upStillDown = false;
};
module.exports = Player;
Player.prototype = Object.create(Phaser.Group.prototype);
Player.prototype.constructor = Player;

Player.AnimationState = {
    WALK_LEFT: "walkLeft",
    WALK_RIGHT: "walkRight",
};

Player.prototype.init = function () {
    "use strict";
    this._sprite = new Phaser.Sprite(this._gameRef, 0, 0, "dog-red");
    //this._sprite.anchor.setTo(0.53125, 0.53125);
    this._sprite.anchor.setTo(0.5, 0.5);
    this.addChild(this._sprite);

    this._movementProperties = new MovementProperties();
    this._movementProperties.BaseSpeed = 10;
    this._movementProperties.OnGround = true;

    this._pos = this._movementProperties.Position;
    this._pos.x = 216;
    this._pos.y = 136;
    this._velocity = this._movementProperties.Velocity;

    this._movementController = new MovementController();
    this._collisionPoints = new CollisionPoints();
    this._collisionPoints.Left.push(new Phaser.Point(-4, 5));
    this._collisionPoints.Left.push(new Phaser.Point(-4, -4));
    this._collisionPoints.Right.push(new Phaser.Point(3, 5));
    this._collisionPoints.Right.push(new Phaser.Point(3, -4));
    this._collisionPoints.Bottom.push(new Phaser.Point(-3, 9));
    this._collisionPoints.Bottom.push(new Phaser.Point(2, 9));
    this._collisionPoints.Top.push(new Phaser.Point(-3, -7));
    this._collisionPoints.Top.push(new Phaser.Point(-2, -7));
    this._tileMapCollider = new TileMapCollider();

    this._animator = new PlayerAnimator();
    this._animator.init(this._sprite);
};

Player.prototype.processInput = function (dt) {
    "use strict";
    if (this._movementProperties.OnGround) {
        this._jumping = false;
        this._jumpControl = false;
        this._animator.CurrentState = "standing";       
        if (this._gameRef.input.keyboard.isDown(Phaser.KeyCode.LEFT)) {
            if (this._velocity.x > 0) {
                this._velocity.x += -this._movementProperties.BaseSpeed * 2;
            }
            else {
                this._velocity.x += -this._movementProperties.BaseSpeed;
            }
            if (this._velocity.x < -this._maxSpeed) {
                this._velocity.x = -this._maxSpeed;
            }
            this._animator.CurrentState = "walking";
            this._animator.Facing = "left";
        }
        if (this._gameRef.input.keyboard.isDown(Phaser.KeyCode.RIGHT)) {
            if (this._velocity.x < 0) {
                this._velocity.x += this._movementProperties.BaseSpeed * 2;
            }
            else {
                this._velocity.x += this._movementProperties.BaseSpeed;
            }
            if (this._velocity.x > this._maxSpeed) {
                this._velocity.x = this._maxSpeed;
            }
            this._animator.CurrentState = "walking";
            this._animator.Facing = "right";
        }
        if (!this._gameRef.input.keyboard.isDown(Phaser.KeyCode.LEFT) && !this._gameRef.input.keyboard.isDown(Phaser.KeyCode.RIGHT)) {
            this._animator.CurrentState = "standing";
            if (this._velocity.x > 0) {
                this._velocity.x -= 20;
                if (this._velocity.x < 0) {
                    this._velocity.x = 0;
                }
            }
            else if (this._velocity.x < 0) {
                this._velocity.x += 20;
                if (this._velocity.x > 0) {
                    this._velocity.x = 0;
                }
            }
        }
        if (this._gameRef.input.keyboard.isDown(Phaser.KeyCode.UP)) {
            if (!this._upStillDown) {
                this._animator.CurrentState = "jumping";
                this._velocity.y = -100;
                this._movementProperties.OnGround = false;
                this._jumpTime = 0;
                this._jumping = true;
                this._jumpControl = true;
                this._upStillDown = true;
            }
        }
        else {
            this._upStillDown = false;
        }
    }
    else {
        if (this._jumping) {
            if (this._movementProperties.BumpedHead) {
                this._jumpControl = false;
                this._velocity.y = 1;
            }

            if (this._jumpControl && this._gameRef.input.keyboard.isDown(Phaser.KeyCode.UP)) {
                this._velocity.y -= 8;
                this._jumpTime += dt;
                if (this._jumpTime > this._maxJumpTIme) {
                    this._jumpControl = false;
                }
            }
            else if (this._jumpControl) {
                if (this._velocity.y < 0) { this._velocity.y *= 0.3; }
                this._jumpControl = false;
                this._upStillDown = false;
            }
        }
        else {
            this._animator.CurrentState = "falling"; 
        }
        if (this._gameRef.input.keyboard.isDown(Phaser.KeyCode.LEFT)) {
            this._velocity.x += -this._movementProperties.BaseSpeed * 0.5;
            if (this._velocity.x < -this._maxSpeed) {
                this._velocity.x = -this._maxSpeed;
            }
        }
        if (this._gameRef.input.keyboard.isDown(Phaser.KeyCode.RIGHT)) {
            this._velocity.x += this._movementProperties.BaseSpeed * 0.5;
            if (this._velocity.x > this._maxSpeed) {
                this._velocity.x = this._maxSpeed;
            }
        }
    }
        
};

Player.prototype.updateMovement = function (dt) {
    "use strict";


    this._movementController.update(this._movementProperties, dt);

    this.x = this._pos.x;
    this.y = this._pos.y;
};

Player.prototype.checkMapCollisions = function (tileMapModel) {
    "use strict";
    this._tileMapCollider.checkTileCollisions(tileMapModel, this._collisionPoints, this._movementProperties);

    this.x = this._pos.x;
    this.y = this._pos.y;
};

Player.prototype.updateAnimation = function () {
    "use strict";
    this._animator.update();
};