this.game = new Phaser.Game(1200, 720, Phaser.AUTO, "tidal-cave", null, false, false);
this.game.state.add("Preloader", require("./states/Preloader"));
this.game.state.add("Game", require("./states/Game"));
this.game.state.add("TitleScreen", require("./states/TitleScreen"));
this.game.state.start("Preloader");