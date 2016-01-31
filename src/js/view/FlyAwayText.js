var FlyAwayText = function (game) {
    "use strict";
    Phaser.Group.call(this, game, null);
    this._gameRef = game;
};
module.exports = FlyAwayText;
FlyAwayText.prototype = Object.create(Phaser.Group.prototype);
FlyAwayText.prototype.constructor = FlyAwayText;

FlyAwayText.prototype.init = function (text, color) {
    "use strict";
    var textField = new Phaser.BitmapText(this._gameRef, 0, 0, "font", text, 16);
    textField.anchor.setTo(0.5, 0.5);
    textField.tint = color;
    this.addChild(textField);

    var flyAwayTweenX = this._gameRef.add.tween(textField);
    flyAwayTweenX.to({x:Math.random() * 32 - 16}, 1000, Phaser.Easing.Linear.None);
    flyAwayTweenX.start();

    var flyAwayTweenY = this._gameRef.add.tween(textField);
    flyAwayTweenY.to({y:-16}, 500, Phaser.Easing.Quadratic.Out);
    flyAwayTweenY.to({y:0, alpha:0}, 500, Phaser.Easing.Quadratic.In);
    flyAwayTweenY.start();
};