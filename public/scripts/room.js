var playerList = document.getElementById("players");
var roomHeader = document.getElementById('displayRoom');
let roomCodeHeader = document.createElement("H1");
roomCodeHeader.innerHTML = "Room Code = " + getRoomCode();
roomHeader.appendChild(roomCodeHeader);
var socket = io();

socket.emit('joinRoom', getRoomCode());

socket.on('lobbyJoin', function (data) {
    console.log('lobbyJoin = ', data);
    let newPlayer = document.createElement("LI");
    newPlayer.innerHTML = data.name;
    newPlayer.id = data.id;
    playerList.appendChild(newPlayer);
});

socket.on('lobbyLeave', function (data) {
    console.log('lobbyLeave = ', data);
    if (document.getElementById(data.id)) {
        let deletePlayer = document.getElementById(data.id);
        console.log(deletePlayer);
        deletePlayer.remove();
    }
});

socket.on('getPlayers', function (data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        if (!document.getElementById(data[i].id)) {
            let newPlayer = document.createElement("LI");
            newPlayer.innerHTML = data[i].name;
            newPlayer.id = data[i].id;
            playerList.appendChild(newPlayer);
        }
    }
});

socket.on('game-start', function() {
    goToGame();
});

function playGame() {
    socket.emit('playGame');
}

function goToGame() {
    window.location.replace("game.html?" + getRoomCode());
}

function getRoomCode() {
    let url = window.location.href;
    let splitUrl = url.split("?")
    let roomCode = splitUrl[splitUrl.length - 1];
    console.log(roomCode);
    return roomCode;
}