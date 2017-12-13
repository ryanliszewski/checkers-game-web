var socket = io('/game');
let gameCode;
var obj;

$('document').ready(function() {
  gameCode = getQueryVariable('gameID');
  if (!gameCode) {
    gameCode = guid();
  }
  obj = {
    name: $('#username-hidden').text(),
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
    socket.emit(obj.gameID, $('#username-hidden').text() + ": " + $('#input-box').val());
    $('#input-box').val('');
    return false;
  });

  socket.on(obj.gameID, function(msg) {
    if (msg == 'Player YOUR TURN!') {
      $('#messages').append($('<li class="your-turn">').text(msg));
    } else if (msg == 'Player has LEFT GAME!') {
      $('#messages').append($('<li class="player-exit">').text(msg));
    } else {
      $('#messages').append($('<li>').text(msg));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });

});
