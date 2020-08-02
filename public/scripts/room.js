var playerList = document.getElementById("players");
var socket = io();

socket.emit('joinRoom', getRoomCode());

socket.on('lobbyJoin', function(data) {
    console.log('lobbyJoin = ', data);
    let newPlayer = document.createElement("LI");
    newPlayer.innerHTML = data;
    newPlayer.id = data;
    playerList.appendChild(newPlayer);
});

socket.on('lobbyLeave', function(data) {
    console.log('lobbyLeave = ', data);
    let deletePlayer = document.getElementById(data);
    console.log(deletePlayer);
    deletePlayer.remove();
});

function getRoomCode() {
    let url = window.location.href;
    let splitUrl = url.split("?")
    let roomCode = splitUrl[splitUrl.length - 1];
    console.log(roomCode);
    return roomCode; 
}