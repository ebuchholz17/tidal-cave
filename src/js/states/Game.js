var LevelParser = require("../model/LevelParser");
var TileMapView = require("../view/TileMapView");
var Player = require("../view/Player");
var Monster = require("../view/Monster");
var FishBoss = require("../view/FishBoss");
var Attack = require("../view/Attack");
var NinjaStar = require("../view/NinjaStar");
var Bomb = require("../view/Bomb");
var Explosion = require("../view/Explosion");
var FlyAwayText = require("../view/FlyAwayText");

var Game = function () {
    "use strict";
    this._bg = null;
    this._gameContainer = null;

    this._levelContainer = null;
    this._tileMapModel = null;
    this._tileMapView = null;

    this._player = null;
    this._monsters = [];

    this._camera = new Phaser.Point(120, 72);
};
module.exports = Game;

Game.prototype = {

    create: function () {
        "use strict";
        this._gameComplete = false;
        this._monsters = [];
        this._camera = new Phaser.Point(120, 72);
        this._gameRef = this.game;
        this._gameRef.stage.smoothed = false;
        this._gameContainer = new Phaser.Group(this._gameRef, null);
        this._gameRef.add.existing(this._gameContainer);
        this._gameContainer.scale.setTo(5, 5);

        this._bg = new Phaser.Sprite(this._gameRef, 0, 0, "bg");
        this._gameContainer.addChild(this._bg);

        this._levelContainer = new Phaser.Group(this._gameRef, null);
        this._gameContainer.addChild(this._levelContainer);

        var levelParser = new LevelParser();
        this._tileMapModel = levelParser.parseLevel(this._gameRef);
        this._tileMapView = new TileMapView(this._gameRef);
        this._tileMapView.init(this._tileMapModel);
        this._levelContainer.addChild(this._tileMapView);

        this._player = new Player(this._gameRef);
        this._player.init(Game.dogType);
        this._levelContainer.addChild(this._player);

        this._oneMonsters = [];
        this._twoMonsters = [];
        this._threeMonsters = [];
        levelParser.parseActors(this._gameRef, this._player._pos, this._oneMonsters, this._twoMonsters, this._threeMonsters);
        var id = 0;
        var monster;
        for (var i = 0; i < this._oneMonsters.length; ++i) {
            monster = new Monster(this._gameRef);
            monster.init("grub");
            monster.onDamage.add(this.onMonsterDamage, this);
            monster.onDeath.add(this.onMonsterDeath, this);
            this._levelContainer.addChild(monster);
            this._monsters.push(monster);
            monster._pos.x = this._oneMonsters[i].x;
            monster._pos.y = this._oneMonsters[i].y;

            monster.ID = id++;
            monster.Damage = 1;
            monster.HP = 5;
            monster.XP = 1;
        }
        for (i = 0; i < this._twoMonsters.length; ++i) {
            monster = new Monster(this._gameRef);
            monster.init("grub2");
            monster.onDamage.add(this.onMonsterDamage, this);
            monster.onDeath.add(this.onMonsterDeath, this);
            this._levelContainer.addChild(monster);
            this._monsters.push(monster);
            monster._pos.x = this._twoMonsters[i].x;
            monster._pos.y = this._twoMonsters[i].y;

            monster.ID = id++;
            monster.Damage = 6;
            monster.HP = 25;
            monster.XP = 3;
        }
        for (i = 0; i < this._threeMonsters.length; ++i) {
            monster = new Monster(this._gameRef);
            monster.init("grub3");
            monster.onDamage.add(this.onMonsterDamage, this);
            monster.onDeath.add(this.onMonsterDeath, this);
            this._levelContainer.addChild(monster);
            this._monsters.push(monster);
            monster._pos.x = this._threeMonsters[i].x;
            monster._pos.y = this._threeMonsters[i].y;

            monster.ID = id++;
            monster.Damage = 13;
            monster.HP = 60;
            monster.XP = 8;
        }

        this._player.onAttack.add(this.onPlayerAttack, this);
        this._player.onNinjaStar.add(this.onPlayerNinjaStar, this);
        this._player.onBomb.add(this.onPlayerBomb, this);
        this._player.onDamage.add(this.onPlayerDamage, this);
        this._player.onDeath.add(this.onPlayerDeath, this);
        this._player.onDeathComplete.add(this.onPlayerDeathComplete, this);
        this._player.onLevelUp.add(this.onPlayerLevelUp, this);


        this._playerLevelText = new Phaser.BitmapText(this._gameRef, 4, 1, "font", "Level: 1", 16);
        this._playerHPText = new Phaser.BitmapText(this._gameRef, 4, 13, "font", "HP: " + Math.max(this._player.HP, 0) + "/" + this._player.MaxHP, 16);
        this._playerXPText = new Phaser.BitmapText(this._gameRef, 4, 25, "font", "XP: " + Math.max(this._player.XP, 0) + "/" + this._player.NextXP, 16);


        this._gameContainer.addChild(this._playerLevelText);
        this._gameContainer.addChild(this._playerHPText);
        this._gameContainer.addChild(this._playerXPText);

        this._fishBoss = new FishBoss(this._gameRef);
        this._fishBoss.init();
        this._fishBoss.onDamage.add(this.onMonsterDamage, this);
        this._fishBoss.onDeath.add(this.onFishDeath, this);
        this._fishBoss.onDeathComplete.add(this.onFishDeathComplete, this);
        this._fishBoss.Damage = 16;
        this._fishBoss.HP = 200;
        this._levelContainer.addChild(this._fishBoss);

        this._waveSprite = new Phaser.Sprite(this._gameRef, 0, 0, "waves");
        this._waveSprite.x = -64;
        this._waveSprite.y = 112;
        this._levelContainer.addChild(this._waveSprite);

        this._maxWaterLevel = 560;
        this._minWaterLevel = 112;
        this._waterTime = 0;
        this._currentWaterLevel = 112;

        this._whiteScreen = new Phaser.Sprite(this._gameRef, 0, 0, "whiteScreen");
        this._whiteScreen.alpha = 0.0;
        this._gameContainer.addChild(this._whiteScreen);

        this._bullets = [];


        var key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
        key1.onDown.add(this.freeXP, this);
    },

    onPlayerAttack: function (playerPos, scale) {
        "use strict";
        var attack = new Attack(this._gameRef);
        attack.onHit.add(this.onAttackHit, this);
        attack.init(playerPos);
        attack.x = playerPos.x;
        attack.y = playerPos.y;
        attack.scale.x = scale;
        this._levelContainer.addChild(attack);
    },

    onPlayerNinjaStar: function (playerPos, scale) {
        "use strict";
        var attack = new NinjaStar(this._gameRef);
        attack.x = playerPos.x;
        attack.y = playerPos.y;
        attack.init(playerPos, scale);
        attack.scale.x = scale;
        this._levelContainer.addChild(attack);
        this._bullets.push(attack);
    },

    onPlayerBomb: function (playerPos, scale) {
        "use strict";
        var attack = new Bomb(this._gameRef);
        attack.x = playerPos.x;
        attack.y = playerPos.y;
        attack.init(playerPos, scale);
        attack.scale.x = scale;
        this._levelContainer.addChild(attack);
        this._bullets.push(attack);
    },

    onAttackHit: function (rekt, attack) {
        "use strict";
        attack.onHit.remove(this.onAttackHit, this);
        for (var i = 0; i < this._monsters.length; ++i) {
            if (!this._monsters[i].Dead && rekt.intersects(this._monsters[i]._hurtBox)) {
                this._monsters[i].doDamage(this._player.Damage, this._player._pos);
            }
        }
        if (rekt.intersects(this._fishBoss._hurtBox)) {
            this._fishBoss.doDamage(this._player.Damage, this._player._pos);
        }
    },
    onBombHit: function (circle, attack) {
        "use strict";
        attack.onHit.remove(this.onBombHit, this);
        for (var i = 0; i < this._monsters.length; ++i) {
            if (!this._monsters[i].Dead && Phaser.Circle.intersectsRectangle(circle, this._monsters[i]._hurtBox)) {
                this._monsters[i].doDamage(this._player.Damage, this._player._pos);
            }
        }
        if (Phaser.Circle.intersectsRectangle(circle, this._fishBoss._hurtBox)) {
            this._fishBoss.doDamage(this._player.Damage, this._player._pos);
        }
    },
    onPlayerDamage: function (damage) {
        "use strict";
        var flyAwayText = new FlyAwayText(this._gameRef);
        flyAwayText.init("" + damage, 0xff0000);
        flyAwayText.x = this._player.x;
        flyAwayText.y = this._player.y;
        this._levelContainer.addChild(flyAwayText);

        this._playerHPText.text = "HP: " + Math.max(this._player.HP, 0) + "/" + this._player.MaxHP;
    },
    onPlayerDeath: function () {
        "use strict";
        this._player.deathAnimation();
    },
    onPlayerDeathComplete: function () {
        "use strict";
        this._player.onAttack.remove(this.onPlayerAttack, this);
        this._player.onDamage.remove(this.onPlayerDamage, this);
        this._player.onDeath.remove(this.onPlayerDeath, this);
        this._player.onNinjaStar.remove(this.onPlayerNinjaStar, this);
        this._player.onDeathComplete.remove(this.onPlayerDeathComplete, this);
        this._player.onBomb.remove(this.onPlayerBomb, this);
        for (var i = 0; i < this._monsters.length; ++i) {
            this._monsters[i].onDamage.remove(this.onMonsterDamage, this);
            this._monsters[i].onDeath.remove(this.onMonsterDeath, this);
        }

        this._gameRef.state.start("TitleScreen", true, false);//restart();
    },
    onPlayerLevelUp: function () {
        "use strict";
        this._playerHPText.text = "HP: " + Math.max(this._player.HP, 0) + "/" + this._player.MaxHP;
        var nextXP = this._player.NextXP;
        if (this._player.Level >= 10) {
            nextXP = "--";
        }
        this._playerXPText.text = "XP: " + Math.max(this._player.XP, 0) + "/" + nextXP;
        this._playerLevelText.text = "Level: " + this._player.Level;

        var flyAwayText = new FlyAwayText(this._gameRef);
        flyAwayText.init("LEVEL UP", 0x00ff00);
        flyAwayText.x = this._player.x;
        flyAwayText.y = this._player.y;
        this._levelContainer.addChild(flyAwayText);
    },


    onMonsterDamage: function (damage, monster) {
        "use strict";
        var flyAwayText = new FlyAwayText(this._gameRef);
        flyAwayText.init("" + damage, 0xffffff);
        flyAwayText.x = monster.x;
        flyAwayText.y = monster.y;
        this._levelContainer.addChild(flyAwayText);
    },
    onMonsterDeath: function (monster) {
        "use strict";
        monster.onDamage.remove(this.onMonsterDamage, this);
        monster.onDeath.remove(this.onMonsterDeath, this);
        monster.deathAnimation();

        var flyAwayText = new FlyAwayText(this._gameRef);
        flyAwayText.init("XP: " + monster.XP, 0x00ff00);
        flyAwayText.x = monster.x;
        flyAwayText.y = monster.y;
        this._levelContainer.addChild(flyAwayText);

        this._player.XP += monster.XP;
        var nextXP = this._player.NextXP;
        if (this._player.Level >= 10) {
            nextXP = "--";
        }
        this._playerXPText.text = "XP: " + Math.max(this._player.XP, 0) + "/" + nextXP;
        if (this._player.XP >= this._player.NextXP) {
            this._player.levelUp();
        }
    },
    freeXP: function () {
        "use strict";
        var flyAwayText = new FlyAwayText(this._gameRef);
        flyAwayText.init("XP: " + 10, 0x00ff00);
        flyAwayText.x = this._player.x;
        flyAwayText.y = this._player.y;
        this._levelContainer.addChild(flyAwayText);

        this._player.XP += 10;
        var nextXP = this._player.NextXP;
        if (this._player.Level >= 10) {
            nextXP = "--";
        }
        this._playerXPText.text = "XP: " + Math.max(this._player.XP, 0) + "/" + nextXP;
        if (this._player.XP >= this._player.NextXP) {
            this._player.levelUp();
        }
    },
    onFishDeath: function () {
        "use strict";
        this._fishBoss.deathAnimation();
        this._gameComplete = true;
        var cameraTween = this._gameRef.add.tween(this._camera);
        cameraTween.to({x:this._fishBoss.x, y:this._fishBoss.y}, 2000, Phaser.Easing.Linear.None);
        cameraTween.start();

        var whiteTween = this._gameRef.add.tween(this._whiteScreen);
        whiteTween.to({alpha:1.0}, 5000, Phaser.Easing.Linear.None);
        whiteTween.start();
    },
    onFishDeathComplete: function () {
        "use strict";
        this._whiteScreen.tint = 0x000001;
        var winText= new Phaser.BitmapText(this._gameRef, 0, 0, "font", "CONGRATULATIONS !!\n\nGOOD !!", 16, "center");
        winText.anchor.setTo(0.5, 0.5);
        this._gameContainer.addChild(winText);
        winText.x = 120;
        winText.y = 72;

        var hitTimer = this._gameRef.time.create(false);
        hitTimer.add(5000, function () { this._gameRef.state.start("TitleScreen", true, false); }, this);
        hitTimer.start();

        this._fishBoss.onDamage.remove(this.onMonsterDamage, this);
        this._fishBoss.onDeath.remove(this.onFishDeath, this);
        this._fishBoss.onDeathComplete.remove(this.onFishDeathComplete, this);
        this._player.onAttack.remove(this.onPlayerAttack, this);
        this._player.onDamage.remove(this.onPlayerDamage, this);
        this._player.onDeath.remove(this.onPlayerDeath, this);
        this._player.onNinjaStar.remove(this.onPlayerNinjaStar, this);
        this._player.onDeathComplete.remove(this.onPlayerDeathComplete, this);
        this._player.onBomb.remove(this.onPlayerBomb, this);
        for (var i = 0; i < this._monsters.length; ++i) {
            this._monsters[i].onDamage.remove(this.onMonsterDamage, this);
            this._monsters[i].onDeath.remove(this.onMonsterDeath, this);
        }
    },

    checkMapCollision: function (pointPos) {
        "use strict";
        var tileX = Math.floor(pointPos.x / 8);
        var tileY = Math.floor(pointPos.y / 8);
        var tileModel = this._tileMapModel.TilesByXY[tileX][tileY];
        if (tileModel.Passable) { return false; }
        return true;
    },

    update: function () {
        "use strict";

        var dt = this._gameRef.time.physicsElapsed;
        if (!this._gameComplete) {
            this._player.processInput(dt);
            for (var i = 0; i < this._monsters.length; ++i) {
                this._monsters[i].processAI(dt);
            }
            this._fishBoss.processAI(dt, this._player._pos, this._currentWaterLevel, this._player._movementProperties.UnderWater );
            this._player.updateMovement(dt);
            for (var i = 0; i < this._monsters.length; ++i) {
                this._monsters[i].updateMovement(dt);
            }
            this._fishBoss.updateMovement(dt);
            this._fishBoss.updatePositions(this._currentWaterLevel);
            this._player.checkMapCollisions(this._tileMapModel);
            for (var i = 0; i < this._monsters.length; ++i) {
                this._monsters[i].checkMapCollisions(this._tileMapModel);
            }
            this._player.updateAnimation();
            if (!this._player.Dead) {
                this._camera.x = this._player.x;
                this._camera.y = this._player.y;
            }

            if (!this._player.Invincible) {
                for (var i = 0; i < this._monsters.length; ++i) {
                    if (!this._monsters[i].Dead && this._monsters[i]._hitBox.intersects(this._player.HurtBox)) {
                        this._player.doDamage(this._monsters[i].Damage);
                        break;
                    }
                }
            }if (!this._player.Invincible) {
                if (this._fishBoss._hitBox.intersects(this._player.HurtBox)) {
                    this._player.doDamage(this._fishBoss.Damage);
                }
            }

            for (var i = this._bullets.length - 1; i >= 0; --i) {
                if (this._bullets[i].dead) {
                    this._bullets.splice(i, 1);
                    continue;
                }
                this._bullets[i].updatePosition(dt);
                if (this.checkMapCollision(this._bullets[i].position)) {
                        this._bullets[i].destroy();
                        if (this._bullets[i] instanceof Bomb) {
                            var attack = new Explosion(this._gameRef);
                            attack.onHit.add(this.onBombHit, this);
                            attack.init(this._bullets[i]);
                            attack.x = this._bullets[i].x;
                            attack.y = this._bullets[i].y;
                            this._levelContainer.addChild(attack);
                        }
                    continue;
                }
                if (this._fishBoss._hurtBox.intersects(this._bullets[i]._rekt)) {
                    if (this._bullets[i] instanceof NinjaStar) {
                        this._fishBoss.doDamage(this._player.Damage, this._player._pos);
                    }
                    this._bullets[i].destroy();
                    if (this._bullets[i] instanceof Bomb) {
                        var attack = new Explosion(this._gameRef);
                        attack.onHit.add(this.onBombHit, this);
                        attack.init(this._bullets[i]);
                        attack.x = this._bullets[i].x;
                        attack.y = this._bullets[i].y;
                        this._levelContainer.addChild(attack);
                    }
                    continue;
                }
                for (var j = 0; j < this._monsters.length; ++j) {
                    if (!this._monsters[j].Dead && this._monsters[j]._hurtBox.intersects(this._bullets[i]._rekt)) {
                        if (this._bullets[i] instanceof NinjaStar) {
                            this._monsters[j].doDamage(this._player.Damage, this._player._pos);
                        }
                        this._bullets[i].destroy();
                        if (this._bullets[i] instanceof Bomb) {
                            var attack = new Explosion(this._gameRef);
                            attack.onHit.add(this.onBombHit, this);
                            attack.init(this._bullets[i]);
                            attack.x = this._bullets[i].x;
                            attack.y = this._bullets[i].y;
                            this._levelContainer.addChild(attack);
                        }
                        break;
                    }
                }
                        
            }

            this._waterTime += dt;
            this._currentWaterLevel = this._minWaterLevel + 0.5 * (1+  Math.sin(this._waterTime * 0.1)) * (this._maxWaterLevel - this._minWaterLevel);
            this._waveSprite.y = this._currentWaterLevel;
            if (this._player._pos.y > this._currentWaterLevel) {
                this._player._movementProperties.UnderWater = true;
            }
            else {
                this._player._movementProperties.UnderWater = false;
            }
        }

        this._levelContainer.x = -this._camera.x + 120;
        this._levelContainer.y = -this._camera.y + 72;
    },

    resize: function () {
        "use strict";
        this._bg.width = 240;
        this._bg.height = 144;

        //this._bg.tileScale.x = this._bg.tileScale.y = 1;
    }
};