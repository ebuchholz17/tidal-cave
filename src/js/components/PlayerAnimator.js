var PlayerAnimator = function () {
    "use strict";
    this._walking = null;
    this._lastState = null;
    this._sprite = null;

    this.CurrentState = "standing";
    this.Facing = "left";
};
module.exports = PlayerAnimator;

PlayerAnimator.prototype = {

    init: function (sprite) {
        "use strict";
        sprite.animations.add("walking", [1, 0], 6, true);
        sprite.animations.add("standing", [0], 6, true);
        sprite.animations.add("jumping",  [1], 6, true);
        sprite.animations.add("falling",  [1], 6, true);

        this._sprite = sprite;
    },

    update: function () {
        "use strict";
        if (this.Facing === "left") {
            this._sprite.scale.x = 1;
        }
        else {
            this._sprite.scale.x = -1;
        }
        if (this._lastState !== this.CurrentState) {
            this._sprite.animations.play(this.CurrentState);
        }

        this._lastState = this.CurrentState;
    }
};