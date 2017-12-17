var socket = io('/game');
let obj;
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
    opponent: getQueryVariable('opponent'),
    gameOwner: getQueryVariable('gameCreator')
  };

     

  io('/').emit('gameListActive', "getMe Data!");
  io('/').on('gameListActive', function(gameList) {
    var temp = JSON.parse(gameList);
    if (temp == null) {
      temp = 0;
    }

    var gameListArray = JSON.parse("[" + temp + "]");
    for(var i = 0; i < gameListArray[0].length; i++) {
      if(gameListArray[0][i]['moveChannel'] == obj.moveChannel) {
          opponent = gameListArray[0][i]['opponent'];
          owner = gameListArray[0][i]['gameCreator'];
              $('#gameOpponent').html("");
              $('#gameOwner').html("");

           if ( (username == opponent)){
              $('#gameOpponent').append($('<h1>' + owner + '</h1>'));
              $('#gameOwner').append($('<h1>' + opponent + '</h1>'));

          }else {
            if ( !opponent ) {
              $('#gameOpponent').append($('<h3>' + "Waiting for Opponent" + '</h3>'));
              }else{
              $('#gameOpponent').append($('<h1>' + opponent + '</h1>'));
              }

            $('#gameOwner').append($('<h1>' + owner + '</h1>'));

            }
      }
    }

  });


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
