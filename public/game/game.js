var config = {
    type: Phaser.AUTO,
<<<<<<< HEAD
    scale: {
        width: 800,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },  

    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 250},
            debug: false // set to true to see sprite hitbox etc
=======
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: false
>>>>>>> 455262beed086981ac0c6dee1ed8ffcc7539ce3e
        }
    },
    scene: {
        preload: preload,
        create: create,
        update, update
    }
};

<<<<<<< HEAD

var controls
=======
var game = new Phaser.Game(config);

>>>>>>> 455262beed086981ac0c6dee1ed8ffcc7539ce3e

function preload() {
    // adding array of character with 178 unique positions
    this.load.spritesheet('mainCharacter', 'assets/mainCharacter.png',{ frameWidth: 64, frameHeight: 64, endFrame: 272 });
<<<<<<< HEAD
    this.load.image('ground', 'assets/platform.png')
}

function create() {
    this.cameras.main.backgroundColor.setTo(61,72,73); // Set background colour using RGB
    var mainCharacterRows = 13;

    var viking = this.physics.add.sprite(100, 450, 'mainCharacter', 6 * (mainCharacterRows) + (7)); // Initially Places the Viking 
    var platforms = this.physics.add.staticGroup(); // Implments Physics
    this.physics.add.collider(viking, platforms);
    this.controls = this.input.keyboard.createCursorKeys(); // Allows the access of user arrow key presses



    //PLATFORM NOTE:
    //platforms.create(X,Y)
    //The greater the X, the further RIGHT. So a negative number is further left.
    //The SMALLER the Y, the HIGHER UP. So a negative number is beyond the top of the screen.

    //Platform Ground
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    


    //Platform Air

    platforms.create(600,450, 'ground');
    platforms.create(30, 400, 'ground');
    platforms.create(-150, 350, 'ground');
    platforms.create(200, 300, 'ground').setScale(0.40).refreshBody();
    platforms.create(350,515, 'ground').setScale(0.65).refreshBody();










    // first number is row index, second is column index, refer to mainCharacter.png to view sprite index




    // Viking Animations:
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('mainCharacter', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'mainCharacter', frame: 4 } ],
        frameRate: 20
    });


    
    //

    

    this.viking = viking;
    
}

function update() {
    controls = this.controls
    viking = this.viking
    if (controls.left.isDown) {
        viking.setVelocityX(-100);
    }
    
    else if (controls.right.isDown) {
        viking.setVelocityX(100);
    } 

    else if (controls.down.isDown) {
        viking.setVelocityY(200)
    }
    
    else {
        viking.setVelocityX(0);
    }

    if (controls.up.isDown && viking.body.touching.down) {
        viking.setVelocityY(-200); //Change this value and all other movement values later. Have some more realistic and controllable X axis movements. THEN also change platform heights.
    }

}

var game = new Phaser.Game(config);
=======
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
>>>>>>> 455262beed086981ac0c6dee1ed8ffcc7539ce3e
