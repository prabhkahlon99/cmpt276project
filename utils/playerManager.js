var players = {}

function addPlayer(id, room) {
    players[id] = {
        x: 100,
        y: 100,
        playerId: id,
        roomId: room
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

module.exports = { addPlayer, getPlayer, getPlayerList, setPlayerX, setPlayerY, removePlayer };