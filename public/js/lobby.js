var socket = io();

document.getElementById("gameGenerate").innerHTML = ' <a href="/game?player=1&gameID=' +
  guid() + '" class="pull-right btn btn-lg btn-info"><i class="fa fa-plus-square-o"></i> Create Game</a>';

$('document').ready(function() {
  socket.emit('gameListActive', "getMe Data!");
  console.log(user);
  socket.emit('addUser', user); 

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
          $('#games').append($('<li>' + gameListArray[0][i]['gameCreator'] + ' <a href="/game?player=2&gameID=' +
            gameListArray[0][i]['gameId'] + '&isGameFull=true' +
            '" class="btn btn-outline-info pull-right"><i class="fa fa-sign-in"></i>  Join Game </a>'));
        }
      }
    }
  });

  $('form').submit(function() {
    var msgObj = {
      username: user,
      message: $('#input-box').val()
    };
    socket.emit('lobbyChat', msgObj);
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
