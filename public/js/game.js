var socket = io('/game');
let gameCode;
let moveChannel;
var obj;

$('document').ready(function() {
  gameCode = getQueryVariable('gameID');
  moveChannel = getQueryVariable('moveChannel');
  if (!moveChannel) {
    moveChannel = guid();
  }
  if (!gameCode) {
    gameCode = guid();
  }
  obj = {
    name: username,
    moveChannel: moveChannel,
    gameID: gameCode,
    isGameFull: getQueryVariable('isGameFull')
  };
  socket.on('connect', function() {
    socket.emit('join', obj, function(err) {
      if (err) {
        alert(err);
      } else {
        console.log('No error');
      }
    });
  });

  $('form').submit(function() {
    socket.emit(obj.gameID, obj.name + ": " + $('#input-box').val());
    $('#input-box').val('');
    return false;
  });

  socket.on(obj.gameID, function(msg) {
    if (msg == 'Your Turn') {
      $('#messages').append($('<li class="your-turn">').text(msg));
    } else if (msg == 'Player has LEFT GAME!') {
      $('#messages').append($('<li class="player-exit">').text(msg));
    } else {
      $('#messages').append($('<li>').text(msg));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });

  console.log("Game Channel:", moveChannel);
  console.log("Chat Channe:", gameCode);

});
