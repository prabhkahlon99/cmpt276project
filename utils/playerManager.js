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

function removePlayer(id) {
    delete players[id];
}

module.exports = {addPlayer, getPlayer, getPlayerList, removePlayer};