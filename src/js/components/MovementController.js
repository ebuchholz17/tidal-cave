var MovementController = function () {
    "use strict";

};
module.exports = MovementController;

MovementController.prototype = {

    update: function (mp, dt) {
        "use strict";
        if (!mp.OnGround) {
            mp.Velocity.y += 8.0;
        }
        else {
            mp.Velocity.y = 0;
        }

        if (mp.Velocity.y > 479) {
            mp.Velocity.y = 479;
        }

        if (Math.abs(mp.Velocity.x) < 0.01) {
            mp.Velocity.x = 0;
        }
        if (Math.abs(mp.Velocity.y) < 0.01) {
            mp.Velocity.y = 0;
        }

        mp.Position.x += mp.Velocity.x * dt;
        mp.Position.y += mp.Velocity.y * dt;
    }
};