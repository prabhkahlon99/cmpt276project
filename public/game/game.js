//TODO clean up code this is hard to read :/

//Phaser stuff
var config = {
    type: Phaser.AUTO,
    scale: {
        width: 1600,
        height: 800,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 250},
            debug: false // set to true to see sprite hitbox etc
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var temperature

var controls;
var movingPlatform1
var keys;
var keySpace;
var keyShift;
var playerVelocityModifier = 0;
var worldHeight;
var worldWidth;
function preload() {
    // adding array of character with 178 unique positions
    this.load.spritesheet('mainCharacter', 'assets/mainCharacter.png', { frameWidth: 64, frameHeight: 64, endFrame: 272 });
    this.load.image('ground', 'assets/platform.png')
    this.load.image('clearBlue', 'assets/yellowClouds.png')
    this.load.image('cloudyBlue', 'assets/cloudyblue.png')
    this.load.image('clearGrey', 'assets/forestCloudy.png')
    this.load.image('cloudyGrey', 'assets/cloudygrey.png')
    this.load.image('rainyGrey', 'assets/orangeRain.png')
    this.load.image('elsePink', 'assets/desertClouds.jpg')
    this.load.image('blueMinimalClouds', 'assets/blueMinimalClouds.png')
    this.load.image('orangeCloudy', 'assets/orangeCloudy.png')
    this.load.image('grassPlatform', 'assets/test.png')
    this.load.image('purpleCloud', 'assets/purpleCloud.png')
    this.load.spritesheet('monsterCharacter', 'assets/monsterCharacter.png', { frameWidth: 64, frameHeight: 64, endFrame: 272 });

    this.load.spritesheet('skeleton', 'assets/skeleton.png', { frameWidth: 64, frameHeight: 64, endFrame: 272 });
    this.load.spritesheet('lizard', 'assets/lizard.png', { frameWidth: 64, frameHeight: 64, endFrame: 272 });
    this.load.spritesheet('heart_healths', 'assets/heart_healths.png', { frameWidth: 108, frameHeight: 32, endFrame: 3 });
    this.load.image('ground', 'assets/platform.png');
    this.load.image('powerupWater', 'assets/temp_bottle.png');
    this.load.image('weapon', 'assets/axe.png');

    this.score = 0;

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


    //
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    //console.log(temperature)
    //console.log(clouds)
    //console.log(status)

    if (temperature >= 15 && clouds < 20 && status == "Clear") {
        this.add.image(800,400,'clearBlue').setScale(0.25) // DONE

    }


    else if (temperature >= 15 && clouds >= 20 && status == "Clouds") {
        this.add.image(800,400, 'blueMinimalClouds').setScale(4.2) // DONE
    }

    else if (temperature < 15 && clouds < 20 && status == "Clear") {
        this.add.image(800,400,'clearGrey').setScale(4.5) // DONE
    }

    else if (temperature < 15 && clouds >= 20 && status == "Clouds") {
        this.add.image(800,400,'orangeCloudy').setScale(6) // DONE
    }

    else if (status == "Drizzle" || status == "Rain") {
        this.add.image(800,400,'orangeRainy').setScale(6) // Done
    }

    else {
        this.add.image(800,400,'elsePink').setScale(0.25)
    }
    // if (temperature >= 15 && )

    //this.cameras.main.backgroundColor.setTo(61,72,73); // Set background colour using RGB
    var mainCharacterRows = 13;

    //Socket IO stuff
    this.socket = io();
    this.roomCode = getRoomCode();
    this.socket.emit('joinGame', this.roomCode);

    //Adding main character to game
    this.otherPlayers = this.physics.add.group({ allowGravity: false });
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
    //this.monster = this.physics.add.sprite(200, 265, 'monsterCharacter', 11 * (mainCharacterRows) + 0);
    this.enemies = this.physics.add.group();
    var monsterTypes = ['monsterCharacter', 'skeleton', 'lizard'];
    var monsterSpawnX = [200, 450, 600];
    var monsterSpawnY = [265, 400, 400];
    for (let i = 0; i < 2; i++) {
        let randomSpawn = Math.floor(Math.random(monsterSpawnX.length) * monsterSpawnX.length)
        let randomType = monsterTypes[Math.floor(Math.random(monsterTypes.length) * monsterTypes.length)];
        console.log(randomSpawn);
        let newEnemy = this.physics.add.sprite(monsterSpawnX[randomSpawn], monsterSpawnY[randomSpawn], randomType, 11 * (mainCharacterRows) + 0);
        newEnemy.isDead = false;
        newEnemy.type = randomType
        newEnemy.isAttacking = false;
        console.log(newEnemy);
        this.enemies.add(newEnemy);
    }

    //Adding skeleton to game
    //this.skeleton = this.physics.add.sprite(600, 400, 'skeleton', 11 * (mainCharacterRows) + 0);

    //Adding lizard to game
    //this.lizard = this.physics.add.sprite(450, 400, 'lizard', 11 * (mainCharacterRows) + 0);

    //Adding health hearts to the game
    this.viking.heart_healths = this.add.sprite(735, 24, 'heart_healths', 0);
    this.viking.hearts = 3;

    //Adds the water bottle power up to the game.
    var waterBottle = this.physics.add.sprite(100, 450, 'powerupWater').setScale(0.2);
    waterBottle.body.setAllowGravity(false);
    this.waterBottle = waterBottle;

    this.axes = this.physics.add.group({
        defaultKey: 'weapon',
        maxSize: 3,
    });

    var viking =  this.viking;
    console.log(viking)
    var platforms = this.physics.add.staticGroup(); // Implments Physics
    

    this.physics.add.collider(viking, platforms); // add collision for the ground/platforms
    viking.body.collideWorldBounds = true; // add collision for the side of the game (can't walk through it)


    //Allows player to pick up water bottle power up
    var bottleCollider = this.physics.add.overlap(viking, waterBottle, powerUpWater.bind(this));
    //var monsterCollider = this.physics.add.overlap(this.axes, this.monster, destroyMonster.bind(this));
    //var skeletonCollider = this.physics.add.overlap(this.axes, this.skeleton, destroySkeleton.bind(this));
    //var lizardCollider = this.physics.add.overlap(this.axes, this.lizard, destroyLizard.bind(this));
    //var monsterDamageCollider = this.physics.add.overlap(viking, this.monster, monsterDamage.bind(this));
    //var lizardDamageCollider = this.physics.add.overlap(viking, this.lizard, lizardDamage.bind(this));
    var damageCollider = this.physics.add.overlap(viking, this.enemies, vikingDamage.bind(this));

    var monsterCollider = this.physics.add.overlap(this.axes, this.enemies, destroyMonster.bind(this));
    //var skeletonCollider = this.physics.add.overlap(this.axes, this.skeleton, destroySkeleton.bind(this));
    //var lizardCollider = this.physics.add.overlap(this.axes, this.lizard, destroyLizard.bind(this));
    //var characterCollider = this.physics.add.overlap(viking, this.monster, destroyViking.bind(this));

    //console.log(this.physics.world.bounds);
    //console.log(this.physics.world.bounds.height);
    worldHeight = this.physics.world.bounds.height;
    worldWidth = this.physics.world.bounds.width;

    //this.physics.add.collider(this.monster, platforms);

    this.physics.add.collider(this.enemies, platforms);

    //this.physics.add.collider(this.monster, viking);
    //this.physics.add.collider(this.skeleton, viking);
    //this.physics.add.collider(this.skeleton, platforms);
    //this.physics.add.collider(this.lizard, platforms);
    //this.physics.add.collider(this.lizard, viking);
    this.controls = this.input.keyboard.createCursorKeys(); // Allows the access of user arrow key presses
    this.input.on('pointerdown', throwAxe, this);
    this.physics.world.on('worldbounds', destroyWeapon);


    //PLATFORM NOTE:
    //platforms.create(X,Y)
    //The greater the X, the further RIGHT. So a negative number is further left.
    //The SMALLER the Y, the HIGHER UP. So a negative number is beyond the top of the screen.

    //Platform Ground
    platforms.create(800, 750, 'purpleCloud').setScale(2.75).refreshBody();
    
    //Platform Air
    // platforms.create(600,450, 'grassPlatform');
    // platforms.create(30, 400, 'purpleCloud');
    // platforms.create(-150, 350, 'ground');
    // platforms.create(200, 300, 'grassPlatform')
    // platforms.create(350,515, 'grassPlatform')

    platforms.create(200, 575, 'purpleCloud').setScale(0.65).refreshBody();
    platforms.create(800, 575, 'purpleCloud').setScale(0.65).refreshBody();
    platforms.create(1400, 575, 'purpleCloud').setScale(0.65).refreshBody();
    platforms.create(800, 330, 'purpleCloud').setScale(1.65).refreshBody();

    //moving platform
    movingPlatform1 = this.physics.add.image(300,660, 'grassPlatform');
    movingPlatform1.setImmovable(true);
    movingPlatform1.body.allowGravity = false;
    movingPlatform1.setVelocityX(100);
    this.physics.add.collider(this.viking, movingPlatform1);
    this.physics.add.collider(this.enemies, movingPlatform1);
    

    movingPlatform2 = this.physics.add.image(400, 450, 'grassPlatform')
    movingPlatform2.setImmovable(true);
    movingPlatform2.body.allowGravity = false;
    movingPlatform2.setVelocityX(200);
    this.physics.add.collider(this.viking, movingPlatform2);
    this.physics.add.collider(this.enemies, movingPlatform2);

    movingPlatform3 = this.physics.add.image(1200, 450, 'grassPlatform')
    movingPlatform3.setImmovable(true);
    movingPlatform3.body.allowGravity = false;
    movingPlatform3.setVelocityX(-200);
    this.physics.add.collider(this.viking, movingPlatform3);
    this.physics.add.collider(this.enemies, movingPlatform3);

    movingPlatform4 = this.physics.add.image(800, 200, 'grassPlatform')
    movingPlatform4.setImmovable(true);
    movingPlatform4.body.allowGravity = false;
    movingPlatform4.setVelocityX(250);
    this.physics.add.collider(this.viking, movingPlatform4);
    this.physics.add.collider(this.enemies, movingPlatform4);

    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
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
        key: 'death',
        frames: this.anims.generateFrameNumbers('mainCharacter', {start: 260, end: 265}),
        frameRate: 12,
        repeat: 0
    });


    this.anims.create({
        key: 'turn',
        frames: [{ key: 'mainCharacter', frame: 4 }],
        frameRate: 20
    });

    console.log("hello");


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
        repeat: 2
    });

    this.anims.create({
        key: 'monsterAttackRight',
        frames: this.anims.generateFrameNumbers('monsterCharacter', { start: 195, end: 200 }),
        frameRate: 8,
        repeat: 2
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

    this.enemies.getChildren().forEach(function (enemy) {
        if (enemy.type == 'monsterCharacter') {
            enemy.setVelocityX(100);
            enemy.anims.play('monsterRight', true);
        }
        if (enemy.type == 'skeleton') {
            enemy.setVelocityX(100);
            enemy.anims.play('skeletonRight', true);
        }
        if (enemy.type == 'lizard') {
            enemy.setVelocityX(-100);
            enemy.anims.play('lizardLeft', true);
        }
    });


    this.viking.isBeingAttacked = false;

    console.log("after lizard is dead end of creaate")

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

    if (movingPlatform1.x >= 1300)
    {
        movingPlatform1.setVelocityX(-100);
    }
    else if (movingPlatform1.x <= 300)
    {
        movingPlatform1.setVelocityX(100);
    }

    
    if (movingPlatform2.x >= 600)
    {
        movingPlatform2.setVelocityX(-200);
    }
    else if (movingPlatform2.x <= 200)
    {
        movingPlatform2.setVelocityX(200);
    }

    
    if (movingPlatform3.x <= 1000)
    {
        movingPlatform3.setVelocityX(200);
    }
    else if (movingPlatform3.x >= 1400)
    {
        movingPlatform3.setVelocityX(-200);
    }

    if (movingPlatform4.x >= 1300)
    {
        movingPlatform4.setVelocityX(-250);
    }
    else if (movingPlatform4.x <= 300)
    {
        movingPlatform4.setVelocityX(250);
    }

    console.log("after moving platform");
    viking = this.viking
    if (controls.left.isDown || this.inputKeys.left.isDown) {
        viking.setVelocityX(-250 - playerVelocityModifier);
        this.viking.anims.play('left', true);
    }

    
    else if (controls.right.isDown || this.inputKeys.right.isDown) {
        viking.setVelocityX(250 + playerVelocityModifier);
        this.viking.anims.play('right', true);
    }

    else if (controls.down.isDown || this.inputKeys.down.isDown) {
        viking.setVelocityY(250 + playerVelocityModifier)
    }

    else {
        viking.setVelocityX(0);
    }

    if ((controls.up.isDown || this.inputKeys.up.isDown) && viking.body.touching.down) {
        viking.setVelocityY(-260 - playerVelocityModifier); //Change this value and all other movement values later. Have some more realistic and controllable X axis movements. THEN also change platform heights.
    }


    keySpace.on('down', function(key, event) {
        if (viking.body.touching.down) {
            viking.setVelocityY(-260 - playerVelocityModifier);
        }
    })





    //Send player movement data to the server if the player moved
    if (this.viking.beforePosition) {
        if (this.viking.x != this.viking.beforePosition.x || this.viking.y != this.viking.beforePosition.y) {
            this.socket.emit('playerMoved', { x: this.viking.x, y: this.viking.y, roomId: this.roomCode });
        }
    }

    this.viking.beforePosition = {
        x: this.viking.x,
        y: this.viking.y
    }
    this.physics.add.collider(this.enemies, movingPlatform1)
    this.physics.add.collider(this.enemies, movingPlatform2)
    this.physics.add.collider(this.enemies, movingPlatform3)
    this.physics.add.collider(this.enemies, movingPlatform4)

    //Monster animation moves back and forth as monster reaches map boundary

    this.enemies.getChildren().forEach(function (enemy) {
        if (enemy.x > config.scale.width) {
            enemy.setVelocityX(-100);
            if (enemy.type == 'monsterCharacter') {
                enemy.anims.play('monsterLeft', true);
            }
            if (enemy.type == 'skeleton') {
                enemy.anims.play('skeletonLeft', true);
            }
            if (enemy.type == 'lizard') {
                enemy.anims.play('lizardLeft', true);
            }
        }
        else if (enemy.x < 0) {
            enemy.setVelocityX(100);
            if (enemy.type == 'monsterCharacter') {
                enemy.anims.play('monsterRight', true);
            }
            if (enemy.type == 'skeleton') {
                enemy.anims.play('skeletonRight', true);
            }
            if (enemy.type == 'lizard') {
                enemy.anims.play('lizardRight', true);
            }
        }
        else if (enemy.body.velocity.x == 0) {
            if(enemy.anims.currentAnim.key == 'monsterLeft') {
                enemy.setVelocityX(100);
                enemy.anims.play('monsterRight', true);
            }
            else if(enemy.anims.currentAnim.key == 'monsterRight') {
                enemy.setVelocityX(-100);
                enemy.anims.play('monsterLeft', true);
            }
            else if(enemy.anims.currentAnim.key == 'skeletonLeft') {
                enemy.setVelocityX(100);
                enemy.anims.play('skeletonRight', true);
            }
            else if(enemy.anims.currentAnim.key == 'skeletonRight') {
                enemy.setVelocityX(-100);
                enemy.anims.play('skeletonLeft', true);
            }
            else if(enemy.anims.currentAnim.key == 'lizardLeft') {
                enemy.setVelocityX(100);
                enemy.anims.play('lizardRight', true);
            }
            else if(enemy.anims.currentAnim.key == 'lizardRight') {
                enemy.setVelocityX(-100);
                enemy.anims.play('lizardLeft', true);
            }
        }
    });

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
    var self = this;
    this.enemies.getChildren().forEach(function (enemy) {
        if (enemy.isDead) {
            return;
        }
        if (!enemy.body.touching.none) {
            enemy.isDead = true;
            if (enemy.type == 'monsterCharacter') {
                enemy.anims.play('monsterDeath', true);
                enemy.setVelocity(0);
                let timer = self.time.delayedCall(800, monsterScore, [], self);
                enemy.destroy();
            }
            if (enemy.type == 'skeleton') {
                enemy.anims.play('skeletonDeath', true);
                enemy.setVelocity(0);
                let timer = self.time.delayedCall(800, monsterScore, [], self);
                enemy.destroy();
            }
            if (enemy.type == 'lizard') {
                enemy.anims.play('lizardDeath', true);
                enemy.setVelocity(0);
                let timer = self.time.delayedCall(800, monsterScore, [], self);
                enemy.destroy();
            }
        }
    });
}

function monsterScore() {
    this.score = this.score + 100;
    this.scoreText.setText('Score: ' + this.score);

}

function vikingDamage(){
    if (this.viking.isBeingAttacked){
        return;
    }
    this.viking.isBeingAttacked = true;
    this.enemies.getChildren().forEach(function (enemy) {
        if (enemy.isDead){
            return;
        }
        if (!enemy.body.touching.none) {
            if (enemy.type == 'monsterCharacter') {
                enemy.setVelocityX(0);
                enemy.isAttacking = true;
                if (enemy.x > this.viking.x ){
                    enemy.anims.play('monsterAttackLeft', true);
                }
                else{
                    enemy.anims.play('monsterAttackRight', true);
                }
                //var timer = this.time.delayedCall(1500, monsterDamageHelper, [], this);
            }
            if (enemy.type == 'skeleton') {
                enemy.isAttacking = true;
                enemy.setVelocityX(0);
                if (enemy.x > this.viking.x ){
                    enemy.anims.play('skeletonShootArrowLeft', true);
                }
                else{
                    enemy.anims.play('skeletonShootArrowRight', true);
                }
            }
            if (enemy.type == 'lizard') {
                enemy.isAttacking = true;
                 enemy.setVelocityX(0);
                if (enemy.x > this.viking.x ){
                    enemy.anims.play('lizardAttackLeft', true);
                }
                else{
                    enemy.anims.play('lizardAttackRight', true);
                }
            }
        }

    });
    var timer = this.time.delayedCall(100, reduceHealth, [], this);
    var timer = this.time.delayedCall(1500, vikingDamageHelper, [], this);
}

function vikingDamageHelper(){
    this.viking.isBeingAttacked = false;
    this.enemies.getChildren().forEach(function (enemy) {
        //if(this.enemy.isDead){
         //   return;
        //}
        if(enemy.isAttacking){
            enemy.isAttacking = false;
            if (enemy.type == 'monsterCharacter'){
                if (enemy.x > this.viking.x ){
                    enemy.anims.play('monsterLeft', true);
                    enemy.setVelocityX(-100);
                }
                else{
                    enemy.anims.play('monsterRight', true);
                    enemy.setVelocityX(100);
                }
            }
            if (enemy.type == 'skeleton'){
                if (enemy.x > this.viking.x ){
                    enemy.anims.play('skeletonLeft', true);
                    enemy.setVelocityX(-100);
                }
                else{
                    enemy.anims.play('skeletonRight', true);
                    enemy.setVelocityX(100);
                }
            }
            if (enemy.type == 'lizard'){
                if (enemy.x > this.viking.x ){
                    enemy.anims.play('lizardLeft', true);
                    enemy.setVelocityX(-100);
                }
                else{
                    enemy.anims.play('lizardRight', true);
                    enemy.setVelocityX(100);
                }
            }

        }
    });
}

function reduceHealth(){
    this.viking.hearts--;
    if (this.viking.hearts < 0){
        this.viking.hearts = 0;
    }
    this.viking.heart_healths = this.add.sprite(735, 24, 'heart_healths', (3-this.viking.hearts));
}


function getRoomCode() {
    let url = window.location.href;
    let splitUrl = url.split("?")
    let roomCode = splitUrl[splitUrl.length - 1];
    //console.log(roomCode);
    return roomCode;
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
var game = new Phaser.Game(config);




