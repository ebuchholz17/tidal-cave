var MovementProperties = require("../components/MovementProperties");
var MovementController = require("../components/MovementController");
var CollisionPoints = require("../components/CollisionPoints");
var TileMapCollider = require("../components/TileMapCollider");
var PlayerAnimator = require("../components/PlayerAnimator");

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
    this._hurtBoxOffset = null;
    this.HurtBox = null;

    this.Invincible = false;
    this._invincibleTimer = 0;
    this._invincibleMax = 1;

    this.InHitStun = false;

    this._xps = [2, 4, 7, 11, 16, 22, 29, 37, 48, 58];
    this._hps = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    this._damages = [1, 2, 4, 7, 11, 16, 22, 29, 37, 48];

    this.HP = 10;
    this.MaxHP = 10;
    this.XP = 0;
    this.NextXP = 2;
    this.Damage = 1;
    this.Level = 1;
    var key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
    key1.onDown.add(this.doDamage, this);

    this.Attacking = false;
    this._attackTimer = 0;
    this._attackMax = 0.5;
    this.onAttack = new Phaser.Signal();
    this.onDamage = new Phaser.Signal();
    this.onLevelUp = new Phaser.Signal();

    this.Dead = false;
    this.onDeath = new Phaser.Signal();
    this.onDeathComplete = new Phaser.Signal();
};
module.exports = Player;
Player.prototype = Object.create(Phaser.Group.prototype);
Player.prototype.constructor = Player;

Player.prototype.init = function () {
    "use strict";
    this._sprite = new Phaser.Sprite(this._gameRef, 0, 0, "dog-red");
    //this._sprite.anchor.setTo(0.53125, 0.53125);
    this._sprite.anchor.setTo(0.5, 0.5);
    this.addChild(this._sprite);

    this._movementProperties = new MovementProperties();
    this._movementProperties.BaseSpeed = 10;
    this._movementProperties.OnGround = true;
    this._movementProperties.UnderWater = true;

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

    this._hurtBoxOffset = new Phaser.Point(-4, -6);
    this.HurtBox = new Phaser.Rectangle(0, 0, 8, 13);
};

Player.prototype.processInput = function (dt) {
    "use strict";
    if (this.Dead) { 
        if (this._movementProperties.OnGround) {
            this._velocity.x = 0;
        }
        return; 
    }

    if (this.Invincible) {
        this._invincibleTimer += dt;
        if (this._invincibleTimer > this._invincibleMax) {
            this.Invincible = false;
            this._animator.Invincible = false;  
            this._invincibleTimer = 0;
        }
    }

    if (this.InHitStun) {
        this._jumping = false;
        this._jumpControl = false;
        this._jumpTime = 0;
        this.Attacking = false;
        this._attackTimer = 0;
        this._animator.CurrentState = "hitstun";  
        if (this._movementProperties.OnGround) {
            this.InHitStun = false;
            this._animator.CurrentState = "standing";  
        } 
    }
    else if (this.Attacking) {
        if (this._movementProperties.OnGround) {
            this._velocity.x = 0;
        }

            this._animator.CurrentState = "attack";  
        this._attackTimer += dt;
        if (this._attackTimer > this._attackMax) {
            this._attackTimer = 0;
            this.Attacking = false;
        }
    }
    else if (this._movementProperties.OnGround) {
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
        if (this._gameRef.input.keyboard.isDown(Phaser.KeyCode.Z)) {
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
        if (this._gameRef.input.keyboard.isDown(Phaser.KeyCode.X) && !this.Attacking) {
            this.Attacking = true;
            var offset;
            if (this._animator.Facing === "right") {
                offset = 16;
            }
            else {
                offset = -16;
            }

            this.onAttack.dispatch(new Phaser.Point(this._pos.x + offset, this._pos.y), this._animator.Facing === "right" ? -1 : 1);
        }
    }
    else {
        if (this._jumping) {
            if (this._movementProperties.BumpedHead) {
                this._jumpControl = false;
                this._velocity.y = 1;
            }

            if (this._jumpControl && this._gameRef.input.keyboard.isDown(Phaser.KeyCode.Z)) {
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
        if (this._velocity.y > 0 && this._gameRef.input.keyboard.isDown(Phaser.KeyCode.Z) && this._movementProperties.UnderWater && !this._jumpControl) {
                this._animator.CurrentState = "jumping";
                this._velocity.y = -100;
                this._movementProperties.OnGround = false;
                this._jumpTime = 0;
                this._jumping = true;
                this._jumpControl = true;
                this._upStillDown = true;
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
        if (this._gameRef.input.keyboard.isDown(Phaser.KeyCode.X) && !this.Attacking) {
            this.Attacking = true;
            var offset;
            if (this._animator.Facing === "right") {
                offset = 16;
            }
            else {
                offset = -16;
            }
            this.onAttack.dispatch(new Phaser.Point(this._pos.x + offset, this._pos.y), this._animator.Facing === "right" ? -1 : 1);
        }
    }
        
};

Player.prototype.updateMovement = function (dt) {
    "use strict";

    if (this.Dead) { 
        return; 
    }

    this._movementController.update(this._movementProperties, dt);

    this.x = this._pos.x;
    this.y = this._pos.y;
    this.HurtBox.x = this.x + this._hurtBoxOffset.x;
    this.HurtBox.y = this.y + this._hurtBoxOffset.y;
};

Player.prototype.checkMapCollisions = function (tileMapModel) {
    "use strict";
    if (this.Dead) { 
        return; 
    }
    this._tileMapCollider.checkTileCollisions(tileMapModel, this._collisionPoints, this._movementProperties);

    this.x = this._pos.x;
    this.y = this._pos.y;
    this.HurtBox.x = this.x + this._hurtBoxOffset.x;
    this.HurtBox.y = this.y + this._hurtBoxOffset.y;
};

Player.prototype.updateAnimation = function () {
    "use strict";
    this._animator.update();
};



Player.prototype.doDamage = function (damage) {
    "use strict";
    if (this.Dead) { 
        return; 
    }
    if (damage !== undefined) {
        this.HP -= damage;

        this.onDamage.dispatch(damage);

        if (this.HP <= 0) {
            this.Dead = true;
            this._animator.Dead = true;
            this.onDeath.dispatch();
        }
    // check death
    }
    this.Invincible = true;
    this._animator.Invincible = true;
    this.InHitStun = true;

    this._velocity.y = -75;
    this._movementProperties.OnGround = false;
    if (this._animator.Facing === "right") {
        this._velocity.x = -75;
    }
    else {
        this._velocity.x = 75;
    }
};

Player.prototype.levelUp = function() {
    "use strict";
    if (this.Level === 10) { return; }
    var newLevel = this.Level;
    var newXp = this.XP;
    var nextXP = this.NextXP;

    do {
        newLevel++;
        newXp -= nextXP;
        if (newLevel - 1 < 10) {
            nextXP = this._xps[newLevel - 1];
        }
    }
    while (newLevel < 10 && newXp >= nextXP); 
    this.XP = newXp;
    this.Level = newLevel;
    this.NextXP = this._xps[this.Level - 1];
    this.MaxHP = this.HP = this._hps[this.Level - 1];
    this.Damage = this._damages[this.Level - 1];
    this.onLevelUp.dispatch();
};

Player.prototype.deathAnimation = function () {
    "use strict";
            this._animator.CurrentState = "standing";
    this.alpha = 0.5;
    var deathTween = this._gameRef.add.tween(this);
    deathTween.to({y:this.y - 200, alpha:0}, 2500, Phaser.Easing.Linear.None);
    deathTween.onComplete.add(function () { this.onDeathComplete.dispatch(); }, this);
    deathTween.start();
};