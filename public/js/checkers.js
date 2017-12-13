
//global variables for one square
var width = 44;
var border = 2;

var selectedPieceCords = getCoords();
var squareToMoveCords = getCoords();

var playerColor;

//Moves
//Player 1 is black and Player 2 is red
var black = 1;
var red = 2;

//Black always moves first
var current_move = 1;

//utility function for translating an x,y coordinate
//to a pixel position

function getPixels(x, y) {
  //ok... so takes an x,y position, returns
  //pixels from the left, right
  return {
    'top': (y * (width + border)) + 'px',
    'left': (x * (width + border)) + 'px'
  };
}

//utility function for turning a pixel position
//into the x,y coordinate of a square on the board
function getCoords(top, left) {
  //returns an x and a y
  //given a top and left pixels
  return {
    'x': left / (width + border),
    'y': top / (width + border)
  };
}

//This function will return true of false
//Some game logic in here
function legalMove(move) {

  //Can't move backwards and straight up 
  if(move.to.y <= move.from.y && move.to.x != move.from.x){
    
    //Single diagonal move 
    if(Math.abs(move.to.x - move.from.x) == 1 && Math.abs(move.to.y - move.from.y) == 1){
      return true; 
    }

    //Jumping
    if(Math.abs(move.to.x - move.from.x) == 2 && Math.abs(move.to.y - move.from.y) == 2){
      return jump(move); 
    }
  //King
  } else if (move.isKing){
    if(Math.abs(move.to.x - move.from.x) == 1 && Math.abs(move.to.y - move.from.y) == 1){
      return true; 
    }

    if(move.to.y - move.from.y > 0 && Math.abs(move.to.x - move.from.x) == 2 && 
      Math.abs(move.to.y - move.from.y) == 2 ){
        return opponentJump(move);
    } 

    if(move.to.y - move.from.y < 0 && Math.abs(move.to.x - move.from.x) == 1 && 
      Math.abs(move.to.y - move.from.y) == 1 ) {
        return jump(move);
    }

  } else {
    return false 
  }
}

//This function will return true or false 
//if you can jump
function jump(move){
  
  var $pieceToBeJumped;
  var pieceColorClassName = '';
  var removePieceColorClassName = ''

  //jump to the right
  if(move.to.x - move.from.x > 0){

    if(move.color == black) {
      pieceColorClassName = 'div.piece.light';
      removePieceColorClassName = 'piece light';
    } else {
      pieceColorClassName = 'div.piece.dark';
      removePieceColorClassName = 'piece dark'
    }
    
    var $piece = $(pieceColorClassName).each(function(index,piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);
      if(coords.x == move.from.x + 1  && coords.y == move.from.y - 1){
        console.log("found piece to be jumped");
        $pieceToBeJumped = $(piece);
      }
    });

    if ($pieceToBeJumped == undefined){
      return false; 
    }

    $pieceToBeJumped.removeClass('piece light');

    $('div.square').removeClass('movable');
    getMovableSquares().addClass('movable');

    move.isJump = true; 
    return true;

  } else {
    if(move.color == black) {
      pieceColorClassName = 'div.piece.light';
      removePieceColorClassName = 'piece light';
    } else {
      pieceColorClassName = 'div.piece.dark';
      removePieceColorClassName = 'piece dark'
    }
    
    var $piece = $(pieceColorClassName).each(function(index,piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);
      if(coords.x == move.from.x - 1  && coords.y == move.from.y - 1){
        console.log("found piece to be jumped");
        $pieceToBeJumped = $(piece);
      }
    });
      
    if ($pieceToBeJumped == undefined){
      return false; 
    }

    $pieceToBeJumped.removeClass(removePieceColorClassName);

    $('div.square').removeClass('movable');
    getMovableSquares().addClass('movable');

    move.isJump = true; 
    return true;
    
  }
}

function opponentJump(move){
  
  var $pieceToBeJumped;
  var pieceColorClassName = '';
  var removePieceColorClassName = ''

  //jump to the right
  if(move.to.x - move.from.x > 0){

    if(move.color == black) {
      pieceColorClassName = 'div.piece.light';
      removePieceColorClassName = 'piece light';
    } else {
      pieceColorClassName = 'div.piece.dark';
      removePieceColorClassName = 'piece dark'
    }
    
    var $piece = $(pieceColorClassName).each(function(index,piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);
      if((coords.x == move.from.x + 1  && coords.y == move.from.y + 1) || (coords.x == move.from.x + 1  && coords.y == move.from.y - 1)){
        console.log("found piece to be jumped");
        $pieceToBeJumped = $(piece);
      }
    });

    if ($pieceToBeJumped == undefined){
      return false; 
    }

    console.log("the piece to be jumped is:" + $pieceToBeJumped);
    $pieceToBeJumped.removeClass('piece light');

    $('div.square').removeClass('movable');
    getMovableSquares().addClass('movable');

    move.isJump = true; 
    return true;


  } else {
    if(move.color == black) {
      pieceColorClassName = 'div.piece.light';
      removePieceColorClassName = 'piece light';
    } else {
      pieceColorClassName = 'div.piece.dark';
      removePieceColorClassName = 'piece dark'
    }
    
    var $piece = $(pieceColorClassName).each(function(index,piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);
      if((coords.x == move.from.x - 1  && coords.y == move.from.y + 1) || (coords.x == move.from.x - 1  && coords.y == move.from.y - 1)){
        console.log("found piece to be jumped");
        $pieceToBeJumped = $(piece);
      }
    });
      
    if ($pieceToBeJumped == undefined){
      return false; 
    }

    $pieceToBeJumped.removeClass(removePieceColorClassName);

    $('div.square').removeClass('movable');
    getMovableSquares().addClass('movable');

    move.isJump = true; 
    return true;
    
  }
}

function gameOver(){

  var opponentPieceColorClass = '';

  var $checkIfPiecesExist = undefined; 

  if (playerColor == red){
    opponentPieceColorClass = 'div.piece.dark';
  } else {
    opponentPieceColorClass = 'div.piece.light';
  }

  var $opponentPiece = $(opponentPieceColorClass).each(function(index,piece) {
    $checkIfPiecesExist = $(piece); 
    return $checkIfPiecesExist; 
  });

  //console.log("opponent piece (game over test): " + $opponentPiece);

  if ($checkIfPiecesExist != undefined) {
    return false 
  } else {
    return true; 
  }
}

//Move's the opponent's piece 
function moveOpponentsPiece(move){

  var $opponentPiece;

  move.from.x = Math.abs(move.from.x - 7); 
  move.from.y = Math.abs(move.from.y - 7);
  move.to.x  = Math.abs(move.to.x - 7);
  move.to.y = Math.abs(move.to.y - 7);


  if (move.color == black) {
    var $opponentsPieces = $('div.piece.dark').each(function(index,piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);

      if(move.from.x == coords.x && move.from.y == coords.y){
        $opponentPiece = $(piece);
        current_move = red; 
      }
    });
  } else {
    var $opponentsPieces = $('div.piece.light').each(function(index,piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);

      if(move.from.x == coords.x && move.from.y == coords.y){
        $opponentPiece = $(piece);
        current_move = black; 
      }
    });
  } 

  if(move.isJump){
    opponentJump(move);     
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

//utility function for returning
//the set of unoccupied dark squares
//(possible places to move a checker piece)
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

function initSockets(){
  socket.emit('gameStatus', gameCode);
  
  socket.on('gameStatus', function(status){
    console.log("game status: ", status);
  });

  socket.on('gameMove', function(move) {
    console.log("RECIEVE MOVE: " , move);
    console.log("gameMove Recieved");
    
    if(move.color != playerColor && !move.gameOver){
      console.log("test");
      moveOpponentsPiece(move); 
    }

    if(move.gameOver && move.color != playerColor){
      document.getElementById("modalBodyText").innerHTML = "Better luck next time " + obj.name + ". You lost!"
      $('#myModal').modal('show');
    }
  });
}


$('document').ready(function() {

  //Client Socket listens for opponent's move
  initSockets();

  //Creating the 64 squares and adding them to the DOM
  var squareCount = 8 * 8;
  for (var i = 0; i < squareCount; i++) {

    //this line creates a new div with the class 'square'
    //and appends it to the div with id 'board'
    $('div#board').append($('<div/>').addClass('square'));
  }

  //YOUR CODE
  //set up the board with the correct classes
  //for the light and dark squares
  setUpBoard();

  //creating the 24 pieces and adding them to the DOM
  var pieceCount = 24;

  for (var i = 0; i < pieceCount; i++) {
    //this line appends an empty div
    //with the class 'piece' to the div with id 'pieces'
    $('div#pieces').append($('<div/>').addClass('piece'));

  }

  //YOUR CODE
  //sets up the classes for the different types of piece
  setUpPieces();

  //this loop moves all the light pieces to their initial positions
  $('div.piece.light').each(function(index, piece, player = getQueryVariable('player')) {

    //turning the index (from 0 - 11)
    //into a x,y square coordinate using math

    playerColor = player; 
    if(playerColor == 1) {
        var y = Math.floor(index / 4);
    } else {
        var y = Math.floor(index / 4) + 5;
    }
    var x = (index % 4) * 2 + (1 - y % 2);

    //turning the x,y coordingate into a pixel position
    var pixelPosition = getPixels(x, y);

    //YOUR CODE
    //actually moving the piece to its initial position
    movePieceTo($(piece), pixelPosition.top, pixelPosition.left, null);    
  });

  //this loop moves all the dark pieces to their initial positions
  $('div.piece.dark').each(function(index, piece, player = getQueryVariable('player')) {

    playerColor = player; 

    //turning the index (from 0 - 11)
    //into a x,y square coordinate using math
    if(playerColor == 2) {
        var y = Math.floor(index / 4);
    } else {
        var y = Math.floor(index / 4) + 5;
    }
    var x = (index % 4) * 2 + (1 - y % 2);

    //turning the x,y coordinate into a pixel position
    var pixelPosition = getPixels(x, y);

    //moving the piece to its initial position
    movePieceTo($(piece), pixelPosition.top, pixelPosition.left, null);
  });

  //set up initial squares
  //the class 'movable' represents a square
  //that is unoccupied
  getMovableSquares().addClass('movable');

  //and now the events
  $('div.piece').click(function() {

    //turn `this` into a jQuery object
    var $this = $(this);

    //Gets selected piece's coordinates
    $this = $this.each(function(index, piece) {
      var position = $(piece).position();
      selectedPieceCords = getCoords(position.top, position.left);
      return $this;
    });

    //toggleing the 'selected' class of this piece
    //Only allows to toggle current_move's pieces
    if ($this.hasClass('piece dark') && current_move == black && playerColor == 1) {
      console.log(current_move);
      toggleSelect($this);
    } else if ($this.hasClass('piece light') && current_move == red && playerColor == 2) {
      toggleSelect($this);
    }
  });

  $('div.square').click(function() {

    //turn `this` into a jQuery object
    var $this = $(this);

    //if $this is a legal square to move to...
    if ($this.hasClass('movable')) {

      //get the piece with the class 'selected'
      var $selectedPiece = $('div.piece.selected');
      //we only move if there is exactly one selected piece
      if ($selectedPiece.length == 1) {
        //get the index of the square
        //and translate it to pixel position
        var index = $this.prevAll().length;
        var x = index % 8;
        var y = Math.floor(index / 8);
        var pixels = getPixels(x, y);
        
        squareToMoveCords.x = x;
        squareToMoveCords.y = y; 

        var move = {from: selectedPieceCords, to:squareToMoveCords, color: null, isJump: false, isKing: false, gameOver: false};

        if($selectedPiece.hasClass('king')){
          move.isKing = true; 
        }

        //Move Dark
        if ($selectedPiece.hasClass('piece dark')) {
          move.color = current_move;

          if(legalMove(move)){
            current_move = red;
            console.log(move);
            movePieceToAcutalMove($selectedPiece, pixels.top, pixels.left, move);
          }
        } else {
            move.color = current_move;
            if(legalMove(move)){
              current_move = black; 
              movePieceToAcutalMove($selectedPiece, pixels.top, pixels.left,move);
            }
        }

        //Check if game is over
        let isGameOver = gameOver();

        if(isGameOver) {
          move.gameOver = true;
          socket.emit('gameMove', move);
          document.getElementById("modalBodyText").innerHTML = "Congratulations " + obj.name + "You won";
          $('#myModal').modal('show');
        }

        //increment the move counter
        incrementMoveCount();

        //un-select the piece
        $selectedPiece.removeClass('selected');

        //set the new legal moves
        $('div.square').removeClass('movable');
        getMovableSquares().addClass('movable');
      }
    }
  });
});

