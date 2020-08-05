//TODO clean up code this is hard to read :/

//Phaser stuff
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
            gravity: { y: 250 },
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
var keys;
var keySpace;
var playerVelocityModifier = 0;
var worldHeight;
var worldWidth;
function preload() {
    // adding array of character with 178 unique positions
    this.load.spritesheet('mainCharacter', 'assets/mainCharacter.png', { frameWidth: 64, frameHeight: 64, endFrame: 272 });
    this.load.image('ground', 'assets/platform.png')
    this.load.image('clearBlue', 'assets/clearblue.png')
    this.load.image('cloudyBlue', 'assets/cloudyblue.png')
    this.load.image('clearGrey', 'assets/cleargrey.png')
    this.load.image('cloudyGrey', 'assets/cloudygrey.png')
    this.load.image('rainyGrey', 'assets/rainygrey.png')
    this.load.image('elsePink', 'assets/elsePink.png')
    this.load.image('blueMinimalClouds', 'assets/blueMinimalClouds.png')
    this.load.image('orangeCloudy', 'assets/orangeCloudy.png')
    this.load.image('grassPlatform', 'assets/test.png')
    this.load.image('purpleCloud', 'assets/purpleCloud.png')
    this.load.spritesheet('monsterCharacter', 'assets/monsterCharacter.png', { frameWidth: 64, frameHeight: 64, endFrame: 272 });

    this.load.spritesheet('skeleton', 'assets/skeleton.png', { frameWidth: 64, frameHeight: 64, endFrame: 272 });
    this.load.spritesheet('lizard', 'assets/lizard.png', { frameWidth: 64, frameHeight: 64, endFrame: 272 });

    this.load.image('ground', 'assets/platform.png');
    this.load.image('powerupWater', 'assets/temp_bottle.png');
    this.load.image('weapon', 'assets/axe.png');

}

function create() {

    $.ajax({
        async: false,
        url: 'https://api.openweathermap.org/data/2.5/weather?lat=49.246292&lon=-123.116226&appid=474febb3cf2438ebe6ae75f0de13355c&units=metric',
        success: function (data) {
            temperature = data["main"]["temp"];
            clouds = data["clouds"]["all"];
            status = data["weather"]["0"]["main"]

        }
    })




    //console.log(temperature)
    //console.log(clouds)
    //console.log(status)

    if (temperature >= 15 && clouds < 20 && status == "Clear") {
        this.add.image(400, 300, 'clearBlue')
        //platforms.create(100,200, 'grassPlatform').setScale(3);

    }


    else if (temperature >= 15 && clouds >= 20 && status == "Clouds") {
        this.add.image(400, 300, 'blueMinimalClouds').setScale(2.75)

    }

    else if (temperature < 15 && clouds < 20 && status == "Clear") {
        this.add.image(400, 300, 'clearGrey')
    }

    else if (temperature < 15 && clouds >= 20 && status == "Clouds") {
        this.add.image(400, 300, 'orangeCloudy').setScale(3.75)
    }

    else if (status == "Drizzle" || status == "Rain") {
        this.add.image(400, 300, 'rainyGrey')
    }

    else {
        this.add.image(400, 300, 'elsePink')
    }
    // if (temperature >= 15 && )

    //this.cameras.main.backgroundColor.setTo(61,72,73); // Set background colour using RGB
    var mainCharacterRows = 13;

    //Socket IO stuff
    this.socket = io();
    this.roomCode = getRoomCode();
    this.socket.emit('joinGame', this.roomCode);

    //Adding main character to game
    this.otherPlayers = this.physics.add.group({allowGravity: false});
    var self = this;
    var viking = self.physics.add.sprite(100, 500, 'mainCharacter', 6 * (mainCharacterRows) + (7)); // Initially Places the Viking 
    //console.log(this.socket);
    this.socket.on('listOfPlayers', function (players) {
        //console.log("hello server?")
        Object.keys(players).forEach(function (id) {
            //console.log(players[id]);
            console.log(players[id].roomId, self.roomCode);
            if (players[id].roomId == self.roomCode) {
                if (players[id].playerId != self.socket.id) {
                    console.log('others');
                    var otherPlayer = self.add.sprite(400, players[id].y + Math.floor(Math.random(10)), 'mainCharacter', 6 * (mainCharacterRows) + (7));
                    otherPlayer.id = players[id].playerId;
                    self.otherPlayers.add(otherPlayer);
                }
            }
        });
    });

    this.socket.on('playerJoin', function (player) {
        if (player.playerId != self.socket.id) {
            var otherPlayer = self.add.sprite(400, player.y + Math.floor(Math.random(10)), 'mainCharacter', 6 * (mainCharacterRows) + (7));
            otherPlayer.id = player.playerId;
            self.otherPlayers.add(otherPlayer);
        }
    });

    this.viking = viking;

    this.socket.on('movePlayer', function (playerPosition) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerPosition.playerId == otherPlayer.id) {
                otherPlayer.setPosition(playerPosition.x, playerPosition.y);
            }
        });
    });

    //Adding monster to game
    this.monster = this.physics.add.sprite(200, 265, 'monsterCharacter', 11 * (mainCharacterRows) + 0);

    //Adding skeleton to game
    this.skeleton = this.physics.add.sprite(600, 400, 'skeleton', 11 * (mainCharacterRows) + 0);

    //Adding lizard to game
    this.lizard = this.physics.add.sprite(450, 400, 'lizard', 11 * (mainCharacterRows) + 0);

    //Adds the water bottle power up to the game.
    var waterBottle = this.physics.add.sprite(100, 450, 'powerupWater').setScale(0.2);
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
    var skeletonCollider = this.physics.add.overlap(this.axes, this.skeleton, destroySkeleton.bind(this));
    var lizardCollider = this.physics.add.overlap(this.axes, this.lizard, destroyLizard.bind(this));
    //var characterCollider = this.physics.add.overlap(viking, this.monster, destroyViking.bind(this));
    //console.log(this.physics.world.bounds);
    //console.log(this.physics.world.bounds.height);
    worldHeight = this.physics.world.bounds.height;
    worldWidth = this.physics.world.bounds.width;
    this.physics.add.collider(this.monster, platforms);
    this.physics.add.collider(this.monster, viking);
    //this.physics.add.collider(this.skeleton, viking);
    this.physics.add.collider(this.skeleton, platforms);
    this.physics.add.collider(this.lizard, platforms);
    //this.physics.add.collider(this.lizard, viking);
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
    platforms.create(600, 450, 'grassPlatform');
    platforms.create(30, 400, 'purpleCloud');
    platforms.create(-150, 350, 'ground');
    platforms.create(200, 300, 'grassPlatform').setScale(0.40).refreshBody();
    platforms.create(350, 515, 'grassPlatform').setScale(0.65).refreshBody();


    // first number is row index, second is column index, refer to mainCharacter.png to view sprite index
    // Viking Animations:
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('mainCharacter', { start: 143, end: 151 }),
        frameRate: 12,
        repeat: 0
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('mainCharacter', { start: 117, end: 125 }),
        frameRate: 12,
        repeat: 0
    });

    this.anims.create({
        key: 'death',
        frames: this.anims.generateFrameNumbers('mainCharacter', { start: 260, end: 265 }),
        frameRate: 12,
        repeat: 0
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'mainCharacter', frame: 4 }],
        frameRate: 20
    });




    // Monster Animations
    this.anims.create({
        key: 'monsterRight',
        frames: this.anims.generateFrameNumbers('monsterCharacter', { start: 143, end: 151 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'monsterLeft',
        frames: this.anims.generateFrameNumbers('monsterCharacter', { start: 117, end: 125 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'monsterDeath',
        frames: this.anims.generateFrameNumbers('monsterCharacter', { start: 260, end: 265 }),
        frameRate: 8,
        repeat: 0
    });

    this.anims.create({
        key: 'monsterAttackLeft',
        frames: this.anims.generateFrameNumbers('monsterCharacter', { start: 169, end: 174 }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'monsterAttackRight',
        frames: this.anims.generateFrameNumbers('monsterCharacter', { start: 195, end: 200 }),
        frameRate: 8,
        repeat: -1
    });

    // Skeleton Animations
    this.anims.create({
        key: 'skeletonRight',
        frames: this.anims.generateFrameNumbers('skeleton', { start: 143, end: 151 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'skeletonLeft',
        frames: this.anims.generateFrameNumbers('skeleton', { start: 117, end: 125 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'skeletonDeath',
        frames: this.anims.generateFrameNumbers('skeleton', { start: 260, end: 265 }),
        frameRate: 8,
        repeat: 0
    });

    this.anims.create({
        key: 'skeletonShootArrowLeft',
        frames: this.anims.generateFrameNumbers('skeleton', { start: 221, end: 233 }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'skeletonShootArrowRight',
        frames: this.anims.generateFrameNumbers('skeleton', { start: 247, end: 259 }),
        frameRate: 8,
        repeat: -1
    });

    // Lizard Animations
    this.anims.create({
        key: 'lizardRight',
        frames: this.anims.generateFrameNumbers('lizard', { start: 143, end: 151 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'lizardLeft',
        frames: this.anims.generateFrameNumbers('lizard', { start: 117, end: 125 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'lizardDeath',
        frames: this.anims.generateFrameNumbers('lizard', { start: 260, end: 265 }),
        frameRate: 8,
        repeat: 0
    });

    this.anims.create({
        key: 'lizardAttackLeft',
        frames: this.anims.generateFrameNumbers('lizard', { start: 169, end: 174 }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'lizardAttackRight',
        frames: this.anims.generateFrameNumbers('lizard', { start: 195, end: 200 }),
        frameRate: 8,
        repeat: -1
    });

    this.monster.setVelocityX(100);
    this.skeleton.setVelocityX(100);
    this.lizard.setVelocityX(-100);

    this.monster.anims.play('monsterRight', true);
    this.skeleton.anims.play('skeletonRight', true);
    this.lizard.anims.play('lizardLeft', true);
}


function update() {
    controls = this.controls
    this.inputKeys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        upSpace: Phaser.Input.Keyboard.KeyCodes.SPACEBAR,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,

    })

    viking = this.viking;
    if (controls.left.isDown || this.inputKeys.left.isDown) {
        viking.setVelocityX(-100 - playerVelocityModifier);
        this.viking.anims.play('left', true);
    }


    else if (controls.right.isDown || this.inputKeys.right.isDown) {
        viking.setVelocityX(100 + playerVelocityModifier);
        this.viking.anims.play('right', true);
    }

    else if (controls.down.isDown || this.inputKeys.down.isDown) {
        viking.setVelocityY(200 + playerVelocityModifier)
    }

    else {
        viking.setVelocityX(0);
    }

    if ((controls.up.isDown || this.inputKeys.up.isDown) && viking.body.touching.down) {
        viking.setVelocityY(-200 - playerVelocityModifier); //Change this value and all other movement values later. Have some more realistic and controllable X axis movements. THEN also change platform heights.
    }

    //Send player movement data to the server if the player moved
    if (this.viking.beforePosition) {
        if (this.viking.x != this.viking.beforePosition.x || this.viking.y != this.viking.beforePosition.y) {
            this.socket.emit('playerMoved', { x: this.viking.x, y: this.viking.y, roomId: this.roomCode});
        }
    }

    this.viking.beforePosition = {
        x: this.viking.x,
        y: this.viking.y
    }

    //Monster animation moves back and forth as monster reaches map boundary

    if (this.monster.x > 280) {
        this.monster.setVelocityX(-100);
        this.monster.anims.play('monsterLeft', true);
    }
    else if (this.monster.x < 130) {
        this.monster.setVelocityX(100);
        this.monster.anims.play('monsterRight', true);
    }

    if (this.skeleton.x > 800) {
        this.skeleton.setVelocityX(-100);
        this.skeleton.anims.play('skeletonLeft', true);
    }
    else if (this.skeleton.x < 400) {
        this.skeleton.setVelocityX(100);
        this.skeleton.anims.play('skeletonRight', true);
    }

    // Lizards walking boundary 
    if (this.lizard.x > 800) {
        this.lizard.setVelocityX(-100);
        this.lizard.anims.play('lizardLeft', true);
    }
    else if (this.lizard.x < 0) {
        this.lizard.setVelocityX(100);
        this.lizard.anims.play('lizardRight', true);
    }

    //Despawn weapon if it's off the screen.
    this.axes.children.each(function (axe) {
        if (axe.active) {
            if (axe.y < 0 || axe.y > worldHeight || axe.x < 0 || axe.x > worldWidth) {
                //console.log("boom");
                axe.setActive(false);
            }
        }
    });
}

//Destroys powerUp on pick up and adds attributes to player.
function powerUpWater() {
    this.waterBottle.destroy();
    //console.log('overlap');
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
    if (axe) {
        axe.body.setAllowGravity(false);
        axe.setActive(true);
        axe.setVisible(true);
        this.physics.moveToObject(axe, pointer, 400);
        //console.log(viking.body.velocity);
        //axe.setVelocity(viking.body.velocity);
    }
}

function destroyWeapon(body) {
    var weapon = body.gameObject;
    //console.log("boom");
    //console.log(weapon);
    if (weapon) {
        weapon.setActive(false);
        weapon.setVisible(false);
        //weapon.destroy();
        //console.log("gone");
    }
}

function destroyMonster() {
    this.monster.anims.play('monsterDeath', true);
    this.monster.setVelocity(0);
    var timer = this.time.delayedCall(800, despawnMonster, [], this);
    //this.monster.destroy();
}

//helper function
function despawnMonster() {
    this.monster.destroy();
}

function destroySkeleton() {
    this.skeleton.anims.play('skeletonDeath', true);
    this.skeleton.setVelocity(0);
    var timer = this.time.delayedCall(800, despawnSkeleton, [], this);
}

//helper function
function despawnSkeleton() {
    this.skeleton.destroy();
}

function destroyLizard() {
    this.lizard.anims.play('lizardDeath', true);
    this.lizard.setVelocity(0);
    var timer = this.time.delayedCall(800, despawnLizard, [], this);
}

//helper function
function despawnLizard() {
    this.lizard.destroy();
}
/*
function destroyViking() {
    this.monster.setVelocityX(0);

    if (this.monster.x > this.viking.x ){
        this.monster.anims.play('monsterAttackLeft', true);
    }
    else{
        this.monster.anims.play('monsterAttackRight', true);
    }
}
*/

function getRoomCode() {
    let url = window.location.href;
    let splitUrl = url.split("?")
    let roomCode = splitUrl[splitUrl.length - 1];
    //console.log(roomCode);
    return roomCode;
}

var game = new Phaser.Game(config);




