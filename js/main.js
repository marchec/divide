import { Platform } from "./entities.js";

const gameObject = {}

const gameConstants = {
    HEIGHT: 600,
    WIDTH: 200,
    NUMBER_OF_PLATFORMS: 10,
    CHANGER_SPAWN_RATE: 0.2,
    JUMP_HEIGHT: 160
} 
document.addEventListener("DOMContentLoaded", () => {
    var config = {
        type: Phaser.AUTO,
        width: gameConstants.WIDTH * 2,
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
    this.load.image('platformWhite', '../img/platformWhite.png')
    this.load.image('playerBlack', '../img/playerBlack.png')
    this.load.image('playerWhite', '../img/playerWhite.png')
    this.load.image('colorChanger', '../img/colorChanger.png')
}

function create() {
    gameObject.platforms = this.physics.add.staticGroup()

    gameObject.colorChangers = this.physics.add.group()

    this.cameras.main.setBackgroundColor('#ffffff')

    const distanceBetweenPlatforms = gameConstants.HEIGHT / gameConstants.NUMBER_OF_PLATFORMS;
    for (let i = 0; i < gameConstants.HEIGHT; i += distanceBetweenPlatforms) {
        const platform = Platform.createPlatform(0, gameConstants.WIDTH, i + distanceBetweenPlatforms / 2)

        gameObject.platforms.create(platform.position.x, platform.position.y, Math.random() > 0.5 ? 'platformBlack' : 'platformWhite')
        if (Math.random() < gameConstants.CHANGER_SPAWN_RATE) {
            gameObject.colorChangers.create(platform.position.x, platform.position.y - 10, 'colorChanger')
        }
    }

    this.physics.add.collider(gameObject.colorChangers, gameObject.platforms)

    gameObject.platforms.getChildren().forEach(child => {
        child.body.checkCollision.left = false
        child.body.checkCollision.down = false
        child.body.checkCollision.right = false
    })

    gameObject.player = this.physics.add.sprite(gameConstants.WIDTH / 2, gameConstants.HEIGHT - 10, 'playerBlack')
    gameObject.player.setCollideWorldBounds(true)

    this.physics.add.collider(gameObject.player, gameObject.platforms)

    this.physics.add.collider(gameObject.player, gameObject.colorChangers, (player, colorChanger) => {
        gameObject.colorChangers.remove(colorChanger, true, true)
        player.setTexture(player.texture.key === 'playerBlack' ? 'playerWhite' : 'playerBlack')
    })

    gameObject.keys = this.input.keyboard.createCursorKeys()

    this.cameras.main.setSize(gameConstants.WIDTH, gameConstants.HEIGHT)
    this.cameras.add(gameConstants.WIDTH, 0, gameConstants.WIDTH, gameConstants.HEIGHT)

    gameObject.score = 0
    gameObject.floorHeight = 0

    gameObject.scoreText = this.add.text(gameConstants.WIDTH - 50, 0, { fontSize: '32px' })
}

function update() {
    if (gameObject.keys.left.isDown) {
        gameObject.player.setVelocityX(-200)
    } else if (gameObject.keys.right.isDown) {
        gameObject.player.setVelocityX(200)
    } else {
        gameObject.player.setVelocityX(0)
    }

    if ((gameObject.player.body.onFloor() || gameObject.player.body.touching.down)) {
        gameObject.player.setVelocityY(-gameConstants.JUMP_HEIGHT)
        gameObject.player.setCollideWorldBounds(false)
    }

    if (gameObject.player.y < 3 * gameConstants.HEIGHT / 4) {
        gameObject.platforms.incY(1)
        ++gameObject.floorHeight

        const disappearing = gameObject.platforms.getChildren().find(e => e.y > gameConstants.HEIGHT)

        if (disappearing) {
            gameObject.platforms.remove(disappearing, true, true)
        }
    }

    if (gameObject.player.x < 0) {
        gameObject.player.x = gameConstants.WIDTH
    }

    if (gameObject.player.x > gameConstants.WIDTH) {
        gameObject.player.x = 0
    }

    const playerHeight = Math.floor(gameObject.floorHeight + (gameConstants.HEIGHT - gameObject.player.y))

    if (playerHeight > gameObject.score) {
        gameObject.score = playerHeight
        gameObject.scoreText.setText(gameObject.score)
    }


    if (!gameObject.platforms.getChildren().find(e => e.y < (gameConstants.HEIGHT / gameConstants.NUMBER_OF_PLATFORMS) * 1.5)) {
        const platform = Platform.createPlatform(0, gameConstants.WIDTH, (gameConstants.HEIGHT / gameConstants.NUMBER_OF_PLATFORMS) / 2)

        const newPlatform = gameObject.platforms.create(platform.position.x, platform.position.y, Math.random() > 0.5 ? 'platformBlack' : 'platformWhite')

        newPlatform.body.checkCollision.down = false
        newPlatform.body.checkCollision.left = false
        newPlatform.body.checkCollision.right = false


        if (Math.random() < gameConstants.CHANGER_SPAWN_RATE) {
            gameObject.colorChangers.create(platform.position.x, platform.position.y - 10, 'colorChanger')
        }
    }


    gameObject.platforms.refresh()

}