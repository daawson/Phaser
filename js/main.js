var game;

window.onload = function() {
    var config = {
        type: Phaser.AUTO,
        width: 600,
        height: 800,
        parent: 'phaser-game',
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
                gravity: { y: 0, x: 0 }
            },
        },
        backgroundColor: Phaser.Display.Color.HexStringToColor("#000000"),
        scene: [SceneMain, SceneRestart]
    }
    game = new Phaser.Game(config);
}