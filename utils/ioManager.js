const crypto = require('crypto');
var rooms = [];
var users = [];

function generateNewRoom() {
    var result = crypto.randomBytes(5).toString('Hex');
    //console.log(result);
    while(!isRoom(result)) {
        result = crypto.randomBytes(5).toString('Hex');
    }
    rooms.push(result);
    let fgh = isRoom(result);
    return result;
}

function removeRoom(roomId) {
    var tempIndex = rooms.findIndex(room => room === roomId);
    //console.log(tempIndex);
    if(tempIndex != -1) {
        return rooms.splice(tempIndex, 1)[0];
    }
}

function isRoom(id) {
    var result = "";
    result = rooms.find(room => room === id);
    //console.log("result = ", result);
    if (result === "") {
        return false;
    }
    else {
        return true;
    }
}

function userJoin(id, name, room) {
    const user = {id, name, room};
    users.push(user);
    return user;
}

function getUser(id) {
    return users.find(user => user.id === id);
}

function userLeave(id) {
    var tempIndex = users.findIndex(user => user.id === id);
    //console.log(tempIndex);
    if(tempIndex != -1) {
        return users.splice(tempIndex, 1)[0];
    }
}

module.exports = {generateNewRoom, isRoom, userJoin, getUser, userLeave};