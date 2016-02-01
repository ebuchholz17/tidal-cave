var Game = require("./Game");

var TitleScreen = function () {
    "use strict";

};
module.exports = TitleScreen;

TitleScreen.prototype = {
    preload: function () {
        "use strict";
},
    create: function () {
        "use strict";
        document.getElementById("game_preloader").style.visibility = "hidden";
        this._gameRef = this.game;
        this._gameContainer = new Phaser.Group(this._gameRef, null);
        this._gameRef.add.existing(this._gameContainer);
        this._gameContainer.scale.setTo(5, 5);

        this._whiteScreen = new Phaser.Sprite(this._gameRef, 0, 0, "whiteScreen");
        this._whiteScreen.tint = 0x000001;
        this._gameContainer.addChild(this._whiteScreen);

        var winText= new Phaser.BitmapText(this._gameRef, 0, 0, "font", "TIDAL CAVE\n\nControls: Z, X, Arrow Keys", 16, "center");
        winText.anchor.setTo(0.5, 0.5);
        this._gameContainer.addChild(winText);
        winText.x = 120;
        winText.y = 50;

        var redDog = new Phaser.Sprite(this._gameRef, 0, 0, "dog-red");
        redDog.anchor.setTo(0.5, 0.5);
        this._gameContainer.addChild(redDog);
        redDog.x = 50;
        redDog.y = 104;

        var greenDog = new Phaser.Sprite(this._gameRef, 0, 0, "dog-green");
        greenDog.anchor.setTo(0.5, 0.5);
        this._gameContainer.addChild(greenDog);
        greenDog.x = 120;
        greenDog.y = 104;

        var blueDog = new Phaser.Sprite(this._gameRef, 0, 0, "dog-blue");
        blueDog.anchor.setTo(0.5, 0.5);
        this._gameContainer.addChild(blueDog);
        blueDog.x = 190;
        blueDog.y = 104;

        var redDogText = new Phaser.BitmapText(this._gameRef, 0, 0, "font", "Sword Dog [1]", 16, "center");
        redDogText.anchor.setTo(0.5, 0.5);
        this._gameContainer.addChild(redDogText);
        redDogText.x = 50;
        redDogText.y = 120;

        var greenDogText = new Phaser.BitmapText(this._gameRef, 0, 0, "font", "Ninja Star Dog [2]", 16, "center");
        greenDogText.anchor.setTo(0.5, 0.5);
        this._gameContainer.addChild(greenDogText);
        greenDogText.x = 120;
        greenDogText.y = 120;

        var blueDogText = new Phaser.BitmapText(this._gameRef, 0, 0, "font", "Bomb Dog [3]", 16, "center");
        blueDogText.anchor.setTo(0.5, 0.5);
        this._gameContainer.addChild(blueDogText);
        blueDogText.x = 190;
        blueDogText.y = 120;


    this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.key1.onDown.add(this.chooseRedDog, this);
    this.key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.key2.onDown.add(this.chooseGreenDog, this);
    this.key3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    this.key3.onDown.add(this.chooseBlueDog, this);
    },
    chooseRedDog: function () {
        "use strict";
        Game.dogType = "dog-red";
        this.startGame();
    },
    chooseGreenDog: function () {
        "use strict";
        Game.dogType = "dog-green";
        this.startGame();
    },
    chooseBlueDog: function () {
        "use strict";
        Game.dogType = "dog-blue";
        this.startGame();
    },

    startGame: function () {
        "use strict";
    this.key1.onDown.remove(this.chooseRedDog, this);
    this.key2.onDown.remove(this.chooseGreenDog, this);
    this.key3.onDown.remove(this.chooseBlueDog, this);
        this._gameRef.input.keyboard.reset();
        this.game.state.start("Game");
    }
};