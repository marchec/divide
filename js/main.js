import { Platform } from "./entities.js";

const gameObject = {}

const gameConstants = {
    HEIGHT: 600,
    WIDTH: 400,
    NUMBER_OF_PLATFORMS: 10
} 
document.addEventListener("DOMContentLoaded", () => {
    var config = {
        type: Phaser.AUTO,
        width: gameConstants.WIDTH,
        height: gameConstants.HEIGHT,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    gameObject.game = new Phaser.Game(config)
})

function preload() {
    this.load.image('platformBlack', '../img/platformBlack.png')
    this.load.image('playerBlack', '../img/playerBlack.png')
}

function create() {
    gameObject.platforms = this.physics.add.staticGroup()

    this.cameras.main.setBackgroundColor('#ffffff')

    const distanceBetweenPlatforms = gameConstants.HEIGHT / gameConstants.NUMBER_OF_PLATFORMS;
    for (let i = 0; i < gameConstants.HEIGHT; i += distanceBetweenPlatforms) {
        const platform = Platform.createPlatform(0, gameConstants.WIDTH, i + distanceBetweenPlatforms / 2)
        
        gameObject.platforms.create(platform.position.x, platform.position.y, 'platformBlack')
    }

    gameObject.player = this.physics.add.sprite(gameConstants.WIDTH / 2, gameConstants.HEIGHT - 10, 'playerBlack')
    gameObject.player.setCollideWorldBounds(true)

    this.physics.add.collider(gameObject.player, gameObject.platforms)
    gameObject.keys = this.input.keyboard.createCursorKeys()
}

function update() {
    if (gameObject.keys.left.isDown) {
        gameObject.player.setVelocityX(-200)
    } else if (gameObject.keys.right.isDown) {
        gameObject.player.setVelocityX(200)
    } else {
        gameObject.player.setVelocityX(0)
    }

    if (gameObject.keys.space.isDown && (gameObject.player.body.onFloor() || gameObject.player.body.touching.down)) {
        gameObject.player.setVelocityY(-180)
    }
}