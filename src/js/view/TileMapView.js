var TileMapView = function (game) {
    "use strict";
    Phaser.Group.call(this, game, null);
    this._gameRef = game;

    this._tileMapModel = null;
    this._tileSprites = [];
};
module.exports = TileMapView;
TileMapView.prototype = Object.create(Phaser.Group.prototype);
TileMapView.prototype.constructor = TileMapView;

TileMapView.prototype.init = function (tileMapModel) {
    "use strict";
    this._tileMapModel = tileMapModel;

    for (var j = 0; j < this._tileMapModel.NumTilesWide; ++j) {
        for (var i = 0; i < this._tileMapModel.NumTilesHigh; ++i) {
            var tileModel = this._tileMapModel.TilesByXY[j][i];
            if (tileModel.TileKey === "-") { continue; }
            var tileSprite = new Phaser.Sprite(this._gameRef, 8 * j, 8 * i, this.getSpriteKey(tileModel.TileKey));
            tileSprite.scale.setTo(1.01, 1.01);
            this.addChild(tileSprite);
        }
    }
    this.cacheAsBitmap = true;
};

TileMapView.prototype.getSpriteKey = function (tileKey) {
    "use strict";
    switch (tileKey) {
    case "X": return "wall";
    case "u": return "wall-up";
    case "d": return "wall-down";
    case "l": return "wall-left";
    case "r": return "wall-right";
    case "g": return "dirt";
    case "f": return "floor";
    case "p": return "rock";
    case "s": return "wall-downleft";
    case "e": return "wall-downright";
    case "3": return "wall-inside-corner-downleft";
    case "2": return "wall-inside-corner-downright";
    case "4": return "wall-inside-corner-upleft";
    case "1": return "wall-inside-corner-upright";
    case "w": return "wall-upleft";
    case "n": return "wall-upright";
    }
};