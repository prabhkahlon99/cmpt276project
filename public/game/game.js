var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update, update
    }
};

var game = new Phaser.Game(config);

function preload() {

}

function create() {
    var rect = new Phaser.Geom.Rectangle(400,300,100,100);
    var graphics = this.add.graphics();
    graphics.fillStyle(0xFFFFFF);
    graphics.fillRectShape(rect);
    var platforms = this.physics.add.staticGroup();

    
    platforms.create(400,300,rect);
}

function update() {

}