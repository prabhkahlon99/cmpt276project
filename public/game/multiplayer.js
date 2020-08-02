var socket = io();

socket.emit('joinGame', getRoomCode());
socket.on('gameJoin', function(data) {
    console.log('connected');
});

function getRoomCode() {
    let url = window.location.href;
    let splitUrl = url.split("?")
    let roomCode = splitUrl[splitUrl.length - 1];
    console.log(roomCode);
    return roomCode;
}