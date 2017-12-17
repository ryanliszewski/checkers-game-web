var socket = io('/game');
var obj;
let moveChannel =  getQueryVariable('moveChannel');

function draw(){
    socket.emit(obj.chatChannel, 'draw');
}
function leavePlayer() {
  socket.emit(obj.chatChannel, 'ForceLeave');
}
function drawDenied() {
  socket.emit(obj.chatChannel, 'Draw Denied');
}
$('document').ready(function() {
  obj = {
    name: username,
    moveChannel: getQueryVariable('moveChannel'),
    chatChannel: getQueryVariable('chatChannel'),
    isGameFull: getQueryVariable('isGameFull'),
    opponent: getQueryVariable('opponent')
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
    var msg = $('#input-box').val();
    if(!(msg == '')) {
      socket.emit(obj.chatChannel, obj.name + ": " + msg);
    }
    $('#input-box').val('');
    return false;
  });
  socket.on(obj.chatChannel, function(msg) {
    console.log(msg);
    if (msg == 'Your Turn') {
      $('#messages').append($('<li class="your-turn">').text(obj.name + ": "+ msg));
    } else if (msg == 'Player has LEFT GAME!') {
      $('#messages').append($('<li class="player-exit">').text(msg));
    } else if (msg == 'draw') {
      $('#drawModal').modal('show');
    } else if (msg == 'Draw Denied') {
      $('#messages').append($('<li class="player-exit">').text(msg));
    } else if (msg == 'ForceLeave') {
      window.location.href = "/lobby";
    } else {
      $('#messages').append($('<li>').text(msg));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });

});
