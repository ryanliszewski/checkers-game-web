//global variables for one square
var width = 44;
var border = 2;

//checker move from and to
var from = getCoords();
var to = getCoords();

var playerColor;

//Player 1 is black and Player 2 is red
var black = 1;
var red = 2;

//Black always moves first
var currentMove = 1;

//utility function for translating an x,y coordinate
//to a pixel position
function getPixels(x, y) {
  return {
    'top': (y * (width + border)) + 'px',
    'left': (x * (width + border)) + 'px'
  };
}

//utility function for turning a pixel position
//into the x,y coordinate of a square on the board
function getCoords(top, left) {
  return {
    'x': left / (width + border),
    'y': top / (width + border)
  };
}

//Return's true or false if move is legal
function legalMove(move) {

  //Can't move backwards and straight up
  if (move.to.y <= move.from.y && move.to.x != move.from.x) {
    //Single
    if (Math.abs(move.to.x - move.from.x) == 1 && Math.abs(move.to.y - move.from.y) == 1) {
      return true;
    }
    //Jumping
    if (Math.abs(move.to.x - move.from.x) == 2 && Math.abs(move.to.y - move.from.y) == 2) {
      return forwardJump(move);
    }
    //King
  } else if (move.isKing) {
    //Single
    if (Math.abs(move.to.x - move.from.x) == 1 && Math.abs(move.to.y - move.from.y) == 1) {
      return true;
    }
    //Backwards Jump
    if (move.to.y - move.from.y > 0 && Math.abs(move.to.x - move.from.x) == 2 &&
      Math.abs(move.to.y - move.from.y) == 2) {
      return backwardsJump(move);
    }
    //Forward Jump
    if (move.to.y - move.from.y < 0 && Math.abs(move.to.x - move.from.x) == 1 &&
      Math.abs(move.to.y - move.from.y) == 1) {
      return forwardJump(move);
    }
  } else {
    return false
  }
}

//This function will return true or false
//if you can jump.
function forwardJump(move) {

  var $pieceToBeJumped;
  var pieceColorClassName = '';
  var removePieceColorClassName = ''

  //jump to the right
  if (move.to.x - move.from.x > 0) {

    if (move.color == black) {
      pieceColorClassName = 'div.piece.light';
      removePieceColorClassName = 'piece light';
    } else {
      pieceColorClassName = 'div.piece.dark';
      removePieceColorClassName = 'piece dark'
    }

    var $piece = $(pieceColorClassName).each(function(index, piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);
      if (coords.x == move.from.x + 1 && coords.y == move.from.y - 1) {
        console.log("found piece to be jumped");
        $pieceToBeJumped = $(piece);
      }
    });

    if ($pieceToBeJumped == undefined) {
      return false;
    }

    $pieceToBeJumped.removeClass('piece light');

    $('div.square').removeClass('movable');
    getMovableSquares().addClass('movable');

    move.isJump = true;
    return true;

  } else {
    if (move.color == black) {
      pieceColorClassName = 'div.piece.light';
      removePieceColorClassName = 'piece light';
    } else {
      pieceColorClassName = 'div.piece.dark';
      removePieceColorClassName = 'piece dark'
    }

    var $piece = $(pieceColorClassName).each(function(index, piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);
      if (coords.x == move.from.x - 1 && coords.y == move.from.y - 1) {
        console.log("found piece to be jumped");
        $pieceToBeJumped = $(piece);
      }
    });

    if ($pieceToBeJumped == undefined) {
      return false;
    }

    $pieceToBeJumped.removeClass(removePieceColorClassName);

    $('div.square').removeClass('movable');
    getMovableSquares().addClass('movable');

    move.isJump = true;
    return true;

  }
}

function backwardsJump(move) {

  var $pieceToBeJumped;
  var pieceColorClassName = '';
  var removePieceColorClassName = '';

  //jump to the right
  if (move.to.x - move.from.x > 0) {

    if (move.color == black) {
      pieceColorClassName = 'div.piece.light';
      removePieceColorClassName = 'piece light';
    } else {
      pieceColorClassName = 'div.piece.dark';
      removePieceColorClassName = 'piece dark'
    }

    var $piece = $(pieceColorClassName).each(function(index, piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);
      if ((coords.x == move.from.x + 1 && coords.y == move.from.y + 1) || (coords.x == move.from.x + 1 && coords.y == move.from.y - 1)) {
        console.log("found piece to be jumped");
        $pieceToBeJumped = $(piece);
      }
    });

    if ($pieceToBeJumped == undefined) {
      return false;
    }

    console.log("the piece to be jumped is:" + $pieceToBeJumped);
    $pieceToBeJumped.removeClass('piece light');

    $('div.square').removeClass('movable');
    getMovableSquares().addClass('movable');

    move.isJump = true;
    return true;


  } else {
    if (move.color == black) {
      pieceColorClassName = 'div.piece.light';
      removePieceColorClassName = 'piece light';
    } else {
      pieceColorClassName = 'div.piece.dark';
      removePieceColorClassName = 'piece dark'
    }

    var $piece = $(pieceColorClassName).each(function(index, piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);
      if ((coords.x == move.from.x - 1 && coords.y == move.from.y + 1) || (coords.x == move.from.x - 1 && coords.y == move.from.y - 1)) {
        console.log("found piece to be jumped");
        $pieceToBeJumped = $(piece);
      }
    });

    if ($pieceToBeJumped == undefined) {
      return false;
    }

    $pieceToBeJumped.removeClass(removePieceColorClassName);

    $('div.square').removeClass('movable');
    getMovableSquares().addClass('movable');

    move.isJump = true;
    return true;

  }
}

function gameOver() {

  var opponentPieceColorClass = '';

  var $checkIfPiecesExist = undefined;

  if (playerColor == red) {
    opponentPieceColorClass = 'div.piece.dark';
  } else {
    opponentPieceColorClass = 'div.piece.light';
  }

  var $opponentPiece = $(opponentPieceColorClass).each(function(index, piece) {
    $checkIfPiecesExist = $(piece);
    return $checkIfPiecesExist;
  });

  if ($checkIfPiecesExist != undefined) {
    return false
  } else {
    return true;
  }
}

//Move's the opponent's piece
function moveOpponentsPiece(move) {

  var $opponentPiece;

  move.from.x = Math.abs(move.from.x - 7);
  move.from.y = Math.abs(move.from.y - 7);
  move.to.x = Math.abs(move.to.x - 7);
  move.to.y = Math.abs(move.to.y - 7);


  if (move.color == black) {
    var $opponentsPieces = $('div.piece.dark').each(function(index, piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);

      if (move.from.x == coords.x && move.from.y == coords.y) {
        $opponentPiece = $(piece);
        currentMove = red;
      }
    });
  } else {
    var $opponentsPieces = $('div.piece.light').each(function(index, piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);

      if (move.from.x == coords.x && move.from.y == coords.y) {
        $opponentPiece = $(piece);
        currentMove = black;
      }
    });
  }

  if (move.isJump) {
    backwardsJump(move);
  }

  toggleSelect($opponentPiece);
  var pixels = getPixels(move.to.x, move.to.y);
  movePieceTo($opponentPiece, pixels.top, pixels.left, move);
  createKing($opponentPiece, move.to);
  $opponentPiece.removeClass('selected');

  //set the new legal moves
  $('div.square').removeClass('movable');
  getMovableSquares().addClass('movable');

}

//return's set of unoccupied dark squares
function getMovableSquares() {

  //select all of the squares
  var $squares = $('div.square');

  //select the occupied ones using the jQuery map() method
  //map creates a new object from an existing one
  //using a translation function
  var $takenSquares =
    $('div.piece').map(function(index, piece) {

      //this function translates a piece
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);
      var squareIndex = coords.y * 8 + coords.x;
      return $squares[squareIndex];
    });

  var $out = $('div.square.dark').not($takenSquares);
  return $out;
}

//Initializes client side socket's for move and game over
function initSockets() {

  socket.on(moveChannel, function(move) {
    console.log("RECIEVE MOVE: ", move);
    console.log("gameMove Recieved");

    if (move.color != playerColor && !move.gameOver) {
      console.log("test");
      moveOpponentsPiece(move);
    }

    if (move.gameOver && move.color != playerColor) {
      document.getElementById("modalBodyText").innerHTML = "Better luck next time " + obj.name + ". You lost!"
      $('#myModal').modal('show');
    }
  });
}


$('document').ready(function() {

  //Client Socket listens for opponent's move
  initSockets();

  var squareCount = 8 * 8;
  for (var i = 0; i < squareCount; i++) {
    $('div#board').append($('<div/>').addClass('square'));
  }

  setUpBoard();

  var pieceCount = 24;

  for (var i = 0; i < pieceCount; i++) {
    $('div#pieces').append($('<div/>').addClass('piece'));
  }

  setUpPieces();

  $('div.piece.light').each(function(index, piece, player = getQueryVariable('player')) {

    playerColor = player;

    if (playerColor == 1) {
      var y = Math.floor(index / 4);
    } else {
      var y = Math.floor(index / 4) + 5;
    }
    var x = (index % 4) * 2 + (1 - y % 2);

    var pixelPosition = getPixels(x, y);

    movePieceTo($(piece), pixelPosition.top, pixelPosition.left, null);
  });

  $('div.piece.dark').each(function(index, piece, player = getQueryVariable('player')) {

    playerColor = player;

    if (playerColor == 2) {
      var y = Math.floor(index / 4);
    } else {
      var y = Math.floor(index / 4) + 5;
    }
    var x = (index % 4) * 2 + (1 - y % 2);

    var pixelPosition = getPixels(x, y);

    movePieceTo($(piece), pixelPosition.top, pixelPosition.left, null);
  });

  getMovableSquares().addClass('movable');

  $('div.piece').click(function() {

    var $this = $(this);

    //Gets selected piece's coordinates
    $this = $this.each(function(index, piece) {
      var position = $(piece).position();
      from = getCoords(position.top, position.left);
      return $this;
    });

    //toggleing the 'selected' class of this piece
    //Only allows to toggle currentMove's pieces
    if ($this.hasClass('piece dark') && currentMove == black && playerColor == 1) {
      toggleSelect($this);
    } else if ($this.hasClass('piece light') && currentMove == red && playerColor == 2) {
      toggleSelect($this);
    }
  });

  $('div.square').click(function() {

    var $this = $(this);

    if ($this.hasClass('movable')) {

      var $selectedPiece = $('div.piece.selected');

      //Can only select one piece
      if ($selectedPiece.length == 1) {

        var index = $this.prevAll().length;
        var x = index % 8;
        var y = Math.floor(index / 8);
        var pixels = getPixels(x, y);

        to.x = x;
        to.y = y;

        //Move object to be passed
        var move = {
          from: from,
          to: to,
          color: null,
          isJump: false,
          isKing: false,
          gameOver: false
        };

        if ($selectedPiece.hasClass('king')) {
          move.isKing = true;
        }

        //Move Dark
        if ($selectedPiece.hasClass('piece dark')) {
          move.color = currentMove;

          if (legalMove(move)) {
            currentMove = red;
            movePieceToAcutalMove($selectedPiece, pixels.top, pixels.left, move);
          }
        } else {
          move.color = currentMove;
          if (legalMove(move)) {
            currentMove = black;
            movePieceToAcutalMove($selectedPiece, pixels.top, pixels.left, move);
          }
        }

        //Check if game is over
        let isGameOver = gameOver();

        if (isGameOver) {
          move.gameOver = true;
          socket.emit('gameMove', move);
          document.getElementById("modalBodyText").innerHTML = "Congratulations " + obj.name + ". You won";
          $('#myModal').modal('show');
        }

        $selectedPiece.removeClass('selected');
        $('div.square').removeClass('movable');
        getMovableSquares().addClass('movable');
      }
    }
  });
});
