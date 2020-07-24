//TODO clean up code this is hard to read :/

var config = {
    type: Phaser.AUTO,
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
            debug: true // set to true to see sprite hitbox etc
        }
    },
    scene: {
        preload: preload,
        create: create,
        update, update
    }
};

var temperature

var controls;
var keySpace;
var playerVelocityModifier = 0;
var worldHeight;
var worldWidth;
function preload() {
    // adding array of character with 178 unique positions
    this.load.spritesheet('mainCharacter', 'assets/mainCharacter.png',{ frameWidth: 64, frameHeight: 64, endFrame: 272 });
    this.load.image('ground', 'assets/platform.png')
    this.load.image('clearBlue', 'assets/clearblue.png')
    this.load.image('cloudyBlue', 'assets/cloudyblue.png')
    this.load.image('clearGrey', 'assets/cleargrey.png')
    this.load.image('cloudyGrey', 'assets/cloudygrey.png')
    this.load.image('rainyGrey', 'assets/rainygrey.png')
    this.load.image('elsePink', 'assets/elsePink.png')

    this.load.spritesheet('monsterCharacter', 'assets/monsterCharacter.png',{ frameWidth: 64, frameHeight: 64, endFrame: 272 });
    this.load.image('ground', 'assets/platform.png');
    this.load.image('powerupWater', 'assets/temp_bottle.png');
    this.load.image('weapon', 'assets/axe.png');

}

function create() {

    $.ajax({
        async: false,
        url: 'https://api.openweathermap.org/data/2.5/weather?lat=49.246292&lon=-123.116226&appid=474febb3cf2438ebe6ae75f0de13355c&units=metric',
        success: function(data) { 
            temperature = data["main"]["temp"];
            clouds = data["clouds"]["all"];
            status = data["weather"]["0"]["main"]
            
        }
    })




    console.log(temperature)
    console.log(clouds)
    console.log(status)
    
    if (temperature >= 15 && clouds < 20 && status == "Clear") {
        this.add.image(400,300,'clearBlue')
    }


    else if (temperature >= 15 && clouds >= 20 && status == "Clouds") {
        this.add.image(400,300, 'cloudyBlue')
    }

    else if (temperature < 15 && clouds < 20 && status == "Clear") {
        this.add.image(400,300,'clearGrey')
    }

    else if (temperature < 15 && clouds >= 20 && status == "Clouds") {
        this.add.image(400,300,'cloudyGrey')
    }

    else if (status == "Drizzle" || status == "Rain") {
        this.add.image(400,300,'rainyGrey')
    }

    else {
        this.add.image(400,300,'elsePink')
    }
    // if (temperature >= 15 && )

    //this.cameras.main.backgroundColor.setTo(61,72,73); // Set background colour using RGB
    var mainCharacterRows = 13;

    //Adding main character to game
    var viking = this.physics.add.sprite(100, 500, 'mainCharacter', 6 * (mainCharacterRows) + (7)); // Initially Places the Viking 
    
    //Adding monster to game
    this.monster = this.physics.add.sprite(200, 200, 'monsterCharacter', 11 * (mainCharacterRows) + 0);

    //Adds the water bottle power up to the game.
    var waterBottle = this.physics.add.sprite(100,450, 'powerupWater').setScale(0.2);
    waterBottle.body.setAllowGravity(false);
    this.waterBottle = waterBottle;

    this.axes = this.physics.add.group({
        defaultKey: 'weapon',
        maxSize: 3,
    });


    var platforms = this.physics.add.staticGroup(); // Implments Physics
    this.physics.add.collider(viking, platforms);
    //Allows player to pick up water bottle power up
    var bottleCollider = this.physics.add.overlap(viking, waterBottle, powerUpWater.bind(this));
    var monsterCollider = this.physics.add.overlap(this.axes, this.monster, destroyMonster.bind(this));
    console.log(this.physics.world.bounds);
    console.log(this.physics.world.bounds.height);
    worldHeight = this.physics.world.bounds.height;
    worldWidth = this.physics.world.bounds.width;
    this.physics.add.collider(this.monster, platforms);
    this.physics.add.collider(this.monster, viking);
    this.controls = this.input.keyboard.createCursorKeys(); // Allows the access of user arrow key presses
    this.input.on('pointerdown', throwAxe, this);
    this.physics.world.on('worldbounds', destroyWeapon);


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
        key: 'right',
        frames: this.anims.generateFrameNumbers('mainCharacter', {start: 143, end: 151}),
        frameRate: 12,
        repeat: 0
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('mainCharacter', {start: 117, end: 125}),
        frameRate: 12,
        repeat: 0
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'mainCharacter', frame: 4 } ],
        frameRate: 20
    });


    // Monster Animations
    this.anims.create({
        key: 'monsterRight',
        frames: this.anims.generateFrameNumbers('monsterCharacter', {start: 143, end: 151}),
        frameRate: 12,
        repeat: -1
    });

     this.anims.create({
        key: 'monsterLeft',
        frames: this.anims.generateFrameNumbers('monsterCharacter', {start: 117, end: 125}),
        frameRate: 12,
        repeat: -1
    });

    this.monster.setVelocityX(100);
    
    this.monster.anims.play('monsterRight', true);
    
    this.viking = viking;
}

function update() {
    controls = this.controls
    viking = this.viking
    if (controls.left.isDown) {
        viking.setVelocityX(-100 - playerVelocityModifier);
        this.viking.anims.play('left', true);
    }
    
    else if (controls.right.isDown) {
        viking.setVelocityX(100 + playerVelocityModifier);
        this.viking.anims.play('right', true);
    } 

    else if (controls.down.isDown) {
        viking.setVelocityY(200 + playerVelocityModifier)
    }
    
    else {
        viking.setVelocityX(0);
    }

    if (controls.up.isDown && viking.body.touching.down) {
        viking.setVelocityY(-200 - playerVelocityModifier); //Change this value and all other movement values later. Have some more realistic and controllable X axis movements. THEN also change platform heights.
    }

    //Monster animation moves back and forth as monster reaches map boundary

    if (this.monster.x > 800){
        this.monster.setVelocityX(-100);
        this.monster.anims.play('monsterLeft', true);
    }
    else if (this.monster.x < 0){
        this.monster.setVelocityX(100);
        this.monster.anims.play('monsterRight', true);
    }

    //Despawn weapon if it's off the screen.
    this.axes.children.each(function(axe) {
        if(axe.active) {
            if (axe.y < 0 || axe.y > worldHeight || axe.x < 0 || axe.x > worldWidth) {
                console.log("boom");
                axe.setActive(false);
            }
        }
    });

}

//Destroys powerUp on pick up and adds attributes to player.
function powerUpWater() {
    this.waterBottle.destroy();
    console.log('overlap');
    playerVelocityModifier = 100;
    var timer = this.time.delayedCall(8000, resetPlayerVelocity, [], this)
}

//Resets the velocity modifier for the player
function resetPlayerVelocity() {
    playerVelocityModifier = 0;
}

function throwAxe(pointer) { // Allows the acces of the space key to create a flying axe //TODO fix velocity and despawn if outside screen
    var vikingX = viking.getWorldTransformMatrix(new Phaser.GameObjects.Components.TransformMatrix()).decomposeMatrix().translateX;
    var vikingY = viking.getWorldTransformMatrix(new Phaser.GameObjects.Components.TransformMatrix()).decomposeMatrix().translateY;
    var axe = this.axes.get(vikingX, vikingY);
    if(axe) {
    axe.body.setAllowGravity(false);
    axe.setActive(true);
    axe.setVisible(true);
    this.physics.moveToObject(axe, pointer, 400);
    console.log(viking.body.velocity);
    //axe.setVelocity(viking.body.velocity);
    }
}

function destroyWeapon(body) {
    var weapon = body.gameObject;
    console.log("boom");
    console.log(weapon);
    if(weapon) {
    weapon.setActive(false);
    weapon.setVisible(false);
    //weapon.destroy();
    console.log("gone");
    }
}

function destroyMonster() {
    this.monster.destroy();
}

var game = new Phaser.Game(config);




