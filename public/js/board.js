//Creates Dark and Light CSS pieces
function setUpPieces() {
  var pieceCount = 24;

  for (var i = 0; i <= pieceCount; i++) {
    if (i % 2 == 0) {
      $('div.piece').eq(i).addClass('light');
    } else {
      $('div.piece').eq(i).addClass('dark');
    }
  }
}

function movePieceTo($piece, newTop, newLeft) {

  $piece.css('top', newTop);
  $piece.css('left', newLeft);
}

function movePieceToAcutalMove($piece, newTop, newLeft, move) {
  createKing($piece, move.to);
  movePieceTo($piece, newTop, newLeft);
  socket.emit('gameMove', move, function(err) {
    if (err) {
      alert(err);
    } else {
      console.log('No error');
    }
  });

  $piece.css('top', newTop);
  $piece.css('left', newLeft);
}

//set's up CSS Board squares
function setUpBoard() {
  //get's entire CSS board
  var $squares = $("div.square");

  //Math helper function to determine if pieces are light or dark
  function lightOrDark(index) {
    
    var x = index % 8;
    var y = Math.floor(index / 8);
    var oddX = x % 2;
    var oddY = y % 2;
    return (oddX ^ oddY);
  }

  for (i = 0; i < $squares.length; i++) {

    if (lightOrDark(i) == 0) {
      $($squares[i]).addClass("light");
    } else {
      $($squares[i]).addClass("dark");
    }
  }
}

function toggleSelect($piece) {

  if ($piece.hasClass('selected'))
    $piece.removeClass('selected');
  else {
    $('div.piece').each(function(index, piece) {
      if ($(piece).hasClass('selected'))
        $(piece).removeClass('selected');
    });
    $piece.addClass('selected');

  }
}

function createKing($piece, to) {

  if (to.y == 0 || to.y == 7) {
    $piece.addClass('king');
  }
}
