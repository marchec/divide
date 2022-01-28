class Position {
    constructor (x, y) {
        this.x = x
        this.y = y
    }
}

class PhysicalEntity {
    constructor(position) {
        this.position = position
    }
}

class Platform extends PhysicalEntity {
    static createPlatform(minX, maxX, height) {
        return new Platform(new Position(minX + Math.random() * (maxX - minX), height))
    }
}

export {Platform}