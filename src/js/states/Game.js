var Game = function () {
    "use strict";
    this._bg = null;
    this._gameContainer = null;
};
module.exports = Game;

Game.prototype = {

    create: function () {
        "use strict";
        document.getElementById('game_preloader').style.visibility = "hidden";
        this._gameRef = this.game;
        this._gameRef.stage.smoothed = false;
        this._gameContainer = new Phaser.Group(this._gameRef, null);
        this._gameRef.add.existing(this._gameContainer);
        this._gameContainer.scale.setTo(5, 5);
        for (var i = 0; i < 30; ++i) {
            for (var j = 0; j < 18; ++j) {
                var bgTile = new Phaser.Sprite(this._gameRef, 0, 0, "bg");
                bgTile.x = i * 8;
                bgTile.y = j * 8;
                this._gameContainer.addChild(bgTile);
            }
        }
        //this._bg = new Phaser.TileSprite(this._gameRef, 0, 0, 240, 144, "bg");
        //this._gameContainer.addChild(this._bg);
    },

    resize: function () {
        "use strict";
        this._bg.width = 240;
        this._bg.height = 144;

        //this._bg.tileScale.x = this._bg.tileScale.y = 1;
    }
};