var socket = io('/game');
let chatChannel;
let moveChannel;
var obj;

$('document').ready(function() {
  chatChannel = getQueryVariable('chatChannel');
  moveChannel = getQueryVariable('moveChannel');
  if (!moveChannel) {
    moveChannel = guid();
  }
  if (!chatChannel) {
    chatChannel = guid();
  }
  obj = {
    name: username,
    moveChannel: moveChannel,
    chatChannel: chatChannel,
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
      $('#messages').append($('<li class="your-turn">').text(msg));
    } else if (msg == 'Player has LEFT GAME!') {
      $('#messages').append($('<li class="player-exit">').text(msg));
    } else {
      $('#messages').append($('<li>').text(msg));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });

  console.log("Move Channel:", moveChannel);
  console.log("Chat Channel:", chatChannel);

});
