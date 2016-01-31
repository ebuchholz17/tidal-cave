var TileMapCollider = function () {
    "use strict";
};
module.exports = TileMapCollider;

TileMapCollider.prototype = {
    checkTileCollisions: function (tileMapModel, collisionPoints, movementProperties) {
        "use strict";
        var i, depth;
        var xResult = 0;
        var yResult = 0;

        var collideLeft = false;
        var collideRight = false;
        var collideUp = false;
        var collideDown = false;
        movementProperties.BumpedHead = false;

        depth = 0;
        if (movementProperties.Velocity.x > 0) {
            var rightPoints = collisionPoints.Right;
            for (i = 0; i < rightPoints.length; ++i) {
                depth = this.getTilePenetrationDepthRight(tileMapModel, rightPoints[i], movementProperties);
                if (depth > xResult) {
                    xResult = depth;
                    collideRight = true;
                }

            }
        }
        else if (movementProperties.Velocity.x < 0) {
            var leftPoints = collisionPoints.Left;
            for (i = 0; i < leftPoints.length; ++i) {
                depth = this.getTilePenetrationDepthLeft(tileMapModel, leftPoints[i], movementProperties);
                if (depth > xResult) {
                    xResult = depth;
                    collideLeft = true;
                }

            }
        }

        if (movementProperties.Velocity.y < 0) {
            var upPoints = collisionPoints.Top;
            for (i = 0; i < upPoints.length; ++i) {
                depth = this.getTilePenetrationDepthUp(tileMapModel, upPoints[i], movementProperties);
                if (depth > yResult) {
                    yResult = depth;
                    collideUp = true;
                }
            }
        }
        else {
            var downPoints = collisionPoints.Bottom;
            for (i = 0; i < downPoints.length; ++i) {
                depth = this.getTilePenetrationDepthDown(tileMapModel, downPoints[i], movementProperties);
                if (depth > yResult) {
                    yResult = depth;
                    collideDown = true;
                }

            }
        }


        if (Math.abs(xResult) > Math.abs(yResult)) {
            if (collideLeft) {
                movementProperties.Position.x += xResult;
                movementProperties.Velocity.x = 0;
            }
            else if (collideRight) {
                movementProperties.Position.x -= xResult;
                movementProperties.Velocity.x = 0;
            }

            if (collideDown) {
                if (!movementProperties.OnGround) {
                    movementProperties.Position.y -= (yResult - 1);
                    movementProperties.OnGround = true;
                    movementProperties.Velocity.y = 0;
                }
            }
            else {
                movementProperties.OnGround = false;
            }

            if (collideUp) {
                movementProperties.BumpedHead = true;
                movementProperties.Position.y += yResult;
                movementProperties.Velocity.y = 1;
            }
        }
        else { 
            if (collideDown) {
                if (!movementProperties.OnGround) {
                    movementProperties.Position.y -= (yResult - 1);
                    movementProperties.OnGround = true;
                    movementProperties.Velocity.y = 0;
                }
            }
            else {
                movementProperties.OnGround = false;
            }

            if (collideUp) {
                movementProperties.BumpedHead = true;
                movementProperties.Position.y += yResult;
                movementProperties.Velocity.y = 1;
            }
            if (collideLeft) {
                movementProperties.Position.x += xResult;
                movementProperties.Velocity.x = 0;
            }
            else if (collideRight) {
                movementProperties.Position.x -= xResult;
                movementProperties.Velocity.x = 0;
            }
        }
    },

    getTilePenetrationDepthDown: function (tileMapModel, point, movementProperties) {
        "use strict";
        var pointPos = new Phaser.Point(point.x + movementProperties.Position.x, point.y + movementProperties.Position.y);
        var tileX = Math.floor(pointPos.x / 8);
        var tileY = Math.floor(pointPos.y / 8);
        var tileModel = tileMapModel.TilesByXY[tileX][tileY];
        if (tileModel.Passable) { return 0; }

        var tilePos = new Phaser.Point(tileX * 8, tileY * 8);
        return pointPos.y - tilePos.y;
    },

    getTilePenetrationDepthUp: function (tileMapModel, point, movementProperties) {
        "use strict";
        var pointPos = new Phaser.Point(point.x + movementProperties.Position.x, point.y + movementProperties.Position.y);
        var tileX = Math.floor(pointPos.x / 8);
        var tileY = Math.floor(pointPos.y / 8);
        var tileModel = tileMapModel.TilesByXY[tileX][tileY];
        if (tileModel.Passable) { return 0; }

        var tilePos = new Phaser.Point(tileX * 8, tileY * 8);
        return (tilePos.y + 8) - pointPos.y;
    },

    getTilePenetrationDepthLeft: function (tileMapModel, point, movementProperties) {
        "use strict";
        var pointPos = new Phaser.Point(point.x + movementProperties.Position.x, point.y + movementProperties.Position.y);
        var tileX = Math.floor(pointPos.x / 8);
        var tileY = Math.floor(pointPos.y / 8);
        var tileModel = tileMapModel.TilesByXY[tileX][tileY];
        if (tileModel.Passable) { return 0; }

        var tilePos = new Phaser.Point(tileX * 8, tileY * 8);
        return (8 + tilePos.x) - pointPos.x;
    },

    getTilePenetrationDepthRight: function (tileMapModel, point, movementProperties) {
        "use strict";
        var pointPos = new Phaser.Point(point.x + movementProperties.Position.x, point.y + movementProperties.Position.y);
        var tileX = Math.floor(pointPos.x / 8);
        var tileY = Math.floor(pointPos.y / 8);
        var tileModel = tileMapModel.TilesByXY[tileX][tileY];
        if (tileModel.Passable) { return 0; }

        var tilePos = new Phaser.Point(tileX * 8, tileY * 8);
        return pointPos.x - tilePos.x;
    }
};
