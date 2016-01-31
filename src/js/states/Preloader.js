var Preloader = function () {
    "use strict";

};
module.exports = Preloader;

Preloader.prototype = {
    preload: function () {
        "use strict";
        //Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.antialias = false;  
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();

        this.load.text("levelData", "../../assets/levels/1.txt");
        this.load.text("actorData", "../../assets/levels/a.txt");

        this.load.image("bg", "../../assets/images/bg.png");
        this.load.image("waves", "../../assets/images/waves.png");

        this.load.image("dirt", "../../assets/images/tiles/dirt.png");
        this.load.image("floor", "../../assets/images/tiles/floor.png");
        this.load.image("rock", "../../assets/images/tiles/rock.png");
        this.load.image("wall-down", "../../assets/images/tiles/wall-down.png");
        this.load.image("wall-downleft", "../../assets/images/tiles/wall-downleft.png");
        this.load.image("wall-downright", "../../assets/images/tiles/wall-downright.png");
        this.load.image("wall-inside-corner-downleft", "../../assets/images/tiles/wall-inside-corner-downleft.png");
        this.load.image("wall-inside-corner-downright", "../../assets/images/tiles/wall-inside-corner-downright.png");
        this.load.image("wall-inside-corner-upleft", "../../assets/images/tiles/wall-inside-corner-upleft.png");
        this.load.image("wall-inside-corner-upright", "../../assets/images/tiles/wall-inside-corner-upright.png");
        this.load.image("wall-left", "../../assets/images/tiles/wall-left.png");
        this.load.image("wall-right", "../../assets/images/tiles/wall-right.png");
        this.load.image("wall-up", "../../assets/images/tiles/wall-up.png");
        this.load.image("wall-upleft", "../../assets/images/tiles/wall-upleft.png");
        this.load.image("wall-upright", "../../assets/images/tiles/wall-upright.png");
        this.load.image("wall", "../../assets/images/tiles/wall.png");

        this.load.spritesheet("dog-red", "../../assets/images/character/dog-red.png", 16, 16);
        this.load.spritesheet("dog-green", "../../assets/images/character/dog-green.png", 16, 16);
        this.load.spritesheet("dog-blue", "../../assets/images/character/dog-blue.png", 16, 16);
        this.load.spritesheet("attack", "../../assets/images/character/attack.png", 16, 16, 4);
        this.load.spritesheet("grub", "../../assets/images/character/grub.png", 16, 16);
        this.load.spritesheet("grub2", "../../assets/images/character/grub2.png", 16, 16);
        this.load.spritesheet("grub3", "../../assets/images/character/grub3.png", 16, 16);

        this.load.bitmapFont("font", "../../assets/fonts/font.png", "../../assets/fonts/font.fnt");

        this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.DOWN);
        this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.UP);
        this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.LEFT);
        this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.RIGHT);
        this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.Z);
        this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.X);
    },

    create: function () {
        "use strict";
        this.game.state.start("Game");
    }
};