let game

document.addEventListener("DOMContentLoaded", () => {
    var config = {
        type: Phaser.AUTO,
        width: 400,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        },
        scene: {
            preload: preload,
            create: create
        }
    };

    game = new Phaser.Game(config)
})

function preload() {
    //
}

function create() {
    //
}