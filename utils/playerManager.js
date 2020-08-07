var players = {};
var monsters = [[]];
var monsterCounter = 0;
var monsterTypes = ['monsterCharacter', 'skeleton', 'lizard'];
var spawnX = [200,1400,500,1100];
var spawnY = [535,535,280,280];
var spawnNum = 0;

function addPlayer(id, room, name) {
    if(spawnNum > 3) {
        spawnNum = 0;
    }
    tempNum = spawnNum;
    spawnNum++
    players[id] = {
        x: spawnX[tempNum],
        y: spawnY[tempNum],
        playerId: id,
        roomId: room,
        name: name
    };
}

function getPlayer(id) {
    return players[id];
}

function getPlayerList() {
    return players;
}

function setPlayerX(id, xPos) {
    players[id].x = xPos;
}

function setPlayerY(id, yPos) {
    players[id].y = yPos;
}

function removePlayer(id) {
    delete players[id];
}

module.exports = { addPlayer, getPlayer, getPlayerList, setPlayerX, setPlayerY, removePlayer};