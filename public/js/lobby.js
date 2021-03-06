var socket = io();

$('document').ready(function() {
  socket.emit('gameListActive', "getMe Data!");
  socket.on('gameListActive', function(gameList) {
    var temp = JSON.parse(gameList);
    if (temp == null) {
      temp = 0;
    }
    var gameListArray = JSON.parse("[" + temp + "]");
    if (gameListArray[0].length == 0) {
      $('#games').html("");
    } else {
      $('#games').html("");
      for (var i = 0; i < gameListArray[0].length; i++) {
        if (gameListArray[0][i]['isGameFull'] == false) {
          $('#games').append($('<li>' + gameListArray[0][i]['gameCreator'] + ' <a href="/game?player=2&chatChannel=' +
            gameListArray[0][i]['chatChannel'] + '&isGameFull=true' + '&opponent=' + username + '&gameOwner=' + gameListArray[0][i]['gameCreator'] +  '&moveChannel=' + gameListArray[0][i]['moveChannel'] +
            '" class="btn btn-outline-info pull-right"><i class="fa fa-sign-in"></i>  Join Game </a>'));
        }
      }
    }
  });

  $('form').submit(function() {
    var msgObj = {
      username: username,
      message: $('#input-box').val()
    };
    if(!(msgObj.message == '')) {
      socket.emit('lobbyChat', msgObj);  
    }
    $('#input-box').val('');
    return false;
  });
  socket.on('lobbyChat', function(msg) {
    $('#messages').append($('<li>').text(msg));
    $('#messages').animate({
      scrollTop: $('#messages').prop("scrollHeight")
    }, 500);
  });
});
