var TileMapModel = require("./TileMapModel");
var TileModel = require("./TileModel");

var LevelParser = function () {
	"use strict";
    this._unpassableTiles = "Xudlrgp1234";
};
module.exports = LevelParser;

LevelParser.prototype = {

    parseLevel: function (game) {
        "use strict";
        var tileMapModel = new TileMapModel();

        var levelData = game.cache.getText("levelData");
        var rows = levelData.match(/[^\r\n]+/g);

        tileMapModel.NumTilesWide = rows[0].length;
        tileMapModel.NumTilesHigh = rows.length;

        for (var j = 0; j < tileMapModel.NumTilesWide; ++j) {
            tileMapModel.TilesByXY[j]= [];
        }

        for (var i = 0; i < rows.length; ++i) {
            for (j = 0; j < rows[i].length; ++j) {
                var tileModel = new TileModel();
                tileModel.TileKey = rows[i][j];
                tileModel.X = j;
                tileModel.Y = i;
                tileModel.Passable = !~this._unpassableTiles.indexOf(tileModel.TileKey);
                tileMapModel.Tiles.push(tileModel);
                tileMapModel.TilesByXY[j][i] = tileModel;
            }
        }

        return tileMapModel;
    },


    parseActors: function (game, playerPos, ones, twos, threes) {
        "use strict";
        var actorData = game.cache.getText("actorData");
        var rows = actorData.match(/[^\r\n]+/g);

        for (var i = 0; i < rows.length; ++i) {
            for (var j = 0; j < rows[i].length; ++j) {
                switch(rows[i][j]) {
                case "P":
                    playerPos.x = j * 8;
                    playerPos.y = i * 8;
                    break;
                case "1":
                    ones.push(new Phaser.Point(j * 8, i * 8));
                    break;
                case "2":
                    twos.push(new Phaser.Point(j * 8, i * 8));
                    break;
                case "3":
                    threes.push(new Phaser.Point(j * 8, i * 8));
                    break;
                }
            }
        }
    }

};