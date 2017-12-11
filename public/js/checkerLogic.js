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

var board;

//Initializes a 2d Array of the checker board
function Board() {
  board = new Array(                );
  for (var i = 0; i < 8; i++) {
    board[i] = new Array();
    for (var j = 0; j < 8; j++){
      //top
      if(i < 3 && j % 2 != 0){
        board[j][i] = 2; 
      } else if (i > 4 && j % 2 == 0){
        board[j][i] = 1; 
      } else {
        board[j][i] = 0; 
      }
    }
  }
  board[-2] = new Array(); // prevents errors
  board[-1] = new Array();
  board[8] = new Array();
  board[9] = new Array();

  console.log(board);
}

//utility function for translating an x,y coordinate
//to a pixel position
//the convention is that the square in the upper left
//corner is at position 0,0
//the square in the upper right, at 7,0 and the lower
//right at 7,7
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
//it follows the same coordinate convention as getPixels
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
  
  if(move.to.y <= move.from.y){
    return true; 
  } else {
    return false; 
  }
  
  
  if(playerColor = black){

  } else {

  }
}

function jump(){

}

function king(){ 

}

function gameOver(){
}

//Move's the opponent's piece 
function moveOpponentsPiece(move){

  var $opponentPiece;

  if (move.color == black) {
    var $opponentsPieces = $('div.piece.dark').each(function(index,piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);

      if(Math.abs(move.from.x - 7) == coords.x && Math.abs(move.from.y - 7) == coords.y){
        $opponentPiece = $(piece);
        current_move = red; 
      }
    });
  } else {
    var $opponentsPieces = $('div.piece.light').each(function(index,piece) {
      var position = $(piece).position();
      var coords = getCoords(position.top, position.left);

      if(Math.abs(move.from.x - 7) == coords.x && Math.abs(move.from.y - 7) == coords.y){
        $opponentPiece = $(piece);
        current_move = black; 
      }
    });
  } 

  console.log($opponentPiece);
  toggleSelect($opponentPiece);
  var pixels = getPixels(Math.abs(move.to.x - 7), Math.abs(move.to.y - 7));
      
  movePieceTo($opponentPiece, pixels.top, pixels.left);
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

$('document').ready(function() {

  //Client Socket listens for opponent's move
  console.log(gameCode);
  socket.emit('gameStatus', gameCode);

  socket.on('gameStatus', function(status){
    console.log("game status: ", status);
  });



  socket.on('gameMove', function(move) {
    console.log("RECIEVE MOVE: " , move);
    console.log("gameMove Recieved");

    if(move.color != playerColor){
      console.log("test");
      moveOpponentsPiece(move); 
    }
  });




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
    movePieceTo($(piece), pixelPosition.top, pixelPosition.left);
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
    movePieceTo($(piece), pixelPosition.top, pixelPosition.left);
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

        var move = {from: selectedPieceCords, to:squareToMoveCords, color: null};

        //Move Dark
        if ($selectedPiece.hasClass('piece dark')) {
          move.color = current_move;

          
            current_move = red;
            movePieceToAcutalMove($selectedPiece, pixels.top, pixels.left, move);
          
          
          // if (y < selectedPieceCords.y) {
          //   if (Math.abs(y - selectedPieceCords.y) <= 2) {
          //     move.color = current_move;
          //     current_move = red;
          //    movePieceToAcutalMove($selectedPiece, pixels.top, pixels.left, move);
          //   }
          // }
          //Move Light
        } else {
              //TODO
            
            move.color = current_move;
          
            current_move = black; 
            movePieceToAcutalMove($selectedPiece, pixels.top, pixels.left, move);
          
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
