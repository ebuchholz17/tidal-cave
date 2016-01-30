var Preloader = function () {
    "use strict";

};
module.exports = Preloader;

Preloader.prototype = {
    preload: function () {
        "use strict";
        Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.antialias = false;  
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();

        this.load.image("bg", "../../assets/bg.png");
        this.load.image("waves", "../../assets/waves.png");
    },

    create: function () {
        "use strict";
        this.game.state.start('Game');
    }
};