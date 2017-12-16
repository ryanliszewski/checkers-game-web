var socket = io('/game');
var obj;

$('document').ready(function() {
  obj = {
    name: username,
    moveChannel: getQueryVariable('moveChannel'),
    chatChannel: getQueryVariable('chatChannel'),
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
    socket.emit(obj.chatChannel, obj.name + ": " + $('#input-box').val());
    $('#input-box').val('');
    return false;
  });

  socket.on(obj.chatChannel, function(msg) {
    if (msg == 'Your Turn') {
      $('#messages').append($('<li class="your-turn">').text(obj.name + ": "+ msg));
    } else if (msg == 'Player has LEFT GAME!') {
      $('#messages').append($('<li class="player-exit">').text(msg));
    } else {
      $('#messages').append($('<li>').text(msg));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });

});
