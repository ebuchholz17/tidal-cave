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
    }

};