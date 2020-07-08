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
    // adding array of character with 178 unique positions
    this.load.spritesheet('mainCharacter', 'assets/mainCharacter.png',{ frameWidth: 64, frameHeight: 64, endFrame: 272 });
}

function create() {
    var rect = new Phaser.Geom.Rectangle(400,300,100,100);
    var graphics = this.add.graphics();
    graphics.fillStyle(0xFFFFFF);
    graphics.fillRectShape(rect);
    var platforms = this.physics.add.staticGroup();

    
    platforms.create(400,300,rect);
    
    //
    var mainCharacterRows = 13;
    // first number is row index, second is column index, refer to mainCharacter.png to view sprite index

    this.add.sprite(100, 200, 'mainCharacter', (6*mainCharacterRows)+(7));
}

function update() {

}