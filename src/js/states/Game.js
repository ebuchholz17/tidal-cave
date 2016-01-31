var LevelParser = require("../model/LevelParser");
var TileMapView = require("../view/TileMapView");
var Player = require("../view/Player");
var Monster = require("../view/Monster");

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
        document.getElementById("game_preloader").style.visibility = "hidden";
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
        this._player.init();
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
            this._levelContainer.addChild(monster);
            this._monsters.push(monster);
            monster._pos.x = this._oneMonsters[i].x;
            monster._pos.y = this._oneMonsters[i].y;

            monster.ID = id++;
            monster.Health = 10;
            monster.XP = 10;
        }
        for (i = 0; i < this._twoMonsters.length; ++i) {
            monster = new Monster(this._gameRef);
            monster.init("grub2");
            this._levelContainer.addChild(monster);
            this._monsters.push(monster);
            monster._pos.x = this._twoMonsters[i].x;
            monster._pos.y = this._twoMonsters[i].y;

            monster.ID = id++;
            monster.Health = 10;
            monster.XP = 10;
        }
        for (i = 0; i < this._threeMonsters.length; ++i) {
            monster = new Monster(this._gameRef);
            monster.init("grub3");
            this._levelContainer.addChild(monster);
            this._monsters.push(monster);
            monster._pos.x = this._threeMonsters[i].x;
            monster._pos.y = this._threeMonsters[i].y;

            monster.ID = id++;
            monster.Health = 10;
            monster.XP = 10;
        }

        this._player._pos.x = 240;
        this._player._pos.y = 136;
    },

    update: function () {
        "use strict";

        var dt = this._gameRef.time.physicsElapsed;
        this._player.processInput(dt);
        this._player.updateMovement(dt);
        this._player.checkMapCollisions(this._tileMapModel);
        this._player.updateAnimation();
        this._camera.x = this._player.x;
        this._camera.y = this._player.y;

        for (var i = 0; i < this._monsters.length; ++i) {
            this._monsters[i].processAI(dt);
            this._monsters[i].updateMovement(dt);
            this._monsters[i].checkMapCollisions(this._tileMapModel);
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