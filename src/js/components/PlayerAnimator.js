var PlayerAnimator = function () {
    "use strict";
    this._walking = null;
    this._lastState = null;
    this._sprite = null;

    this.CurrentState = "standing";
    this.Facing = "left";
    this.Invincible = false;

    this._invincibleSwitch = false;
};
module.exports = PlayerAnimator;

PlayerAnimator.prototype = {

    init: function (sprite) {
        "use strict";
        sprite.animations.add("walking", [1, 0], 6, true);
        sprite.animations.add("standing", [0], 6, true);
        sprite.animations.add("jumping",  [1], 6, true);
        sprite.animations.add("falling",  [1], 6, true);
        sprite.animations.add("hitstun",  [1], 6, true);
        sprite.animations.add("attack",  [2], 6, true);

        this._sprite = sprite;
    },

    update: function () {
        "use strict";
        if (this._lastState !== this.CurrentState) {
            this._sprite.animations.play(this.CurrentState);
        }
        if (this.Dead) {
            this._sprite.visible = true;
            return;
        }

        if (this.Facing === "left") {
            this._sprite.scale.x = 1;
        }
        else {
            this._sprite.scale.x = -1;
        }

        if (this.Invincible) {
            this._sprite.visible = this._invincibleSwitch;
            this._invincibleSwitch = !this._invincibleSwitch;
        }
        else {
            this._sprite.visible = true;
        }

        this._lastState = this.CurrentState;
    }
};