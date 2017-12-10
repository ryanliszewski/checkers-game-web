var socket = io('/game');
//global variables for one square
var width = 44;
var border = 2;

var selectedPieceCords = getCoords();
var squareToMoveCords = getCoords();

//Moves
var black = -1;
var red = 1;

//Black always moves first
var current_move = -1;

var board;
Board(1, 0, 1, 0, 1, 0, 1, 0,
  0, 1, 0, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 1, 0, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, -1, 0, -1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0, -1, 0,
  0, -1, 0, -1, 0, -1, 0, -1);


//Initializes a 2d Array of the checker board
function Board() {
  board = new Array();
  for (var i = 0; i < 8; i++) {
    board[i] = new Array();
    for (var j = 0; j < 8; j++)
      board[i][j] = Board.arguments[8 * j + i];
  }
  board[-2] = new Array(); // prevents errors
  board[-1] = new Array();
  board[8] = new Array();
  board[9] = new Array();
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

function legalMove(from, to) {
  //TODO
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

  console.log("testing123");

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
  $('div.piece.light').each(function(index, piece) {

    //turning the index (from 0 - 11)
    //into a x,y square coordinate using math
    var y = Math.floor(index / 4);
    var x = (index % 4) * 2 + (1 - y % 2);

    //turning the x,y coordingate into a pixel position
    var pixelPosition = getPixels(x, y);

    //YOUR CODE
    //actually moving the piece to its initial position
    movePieceTo($(piece), pixelPosition.top, pixelPosition.left, socket);
  });

  //this loop moves all the dark pieces to their initial positions
  $('div.piece.dark').each(function(index, piece) {

    //turning the index (from 0 - 11)
    //into a x,y square coordinate using math
    var y = Math.floor(index / 4) + 5;
    var x = (index % 4) * 2 + (1 - y % 2);

    //turning the x,y coordinate into a pixel position
    var pixelPosition = getPixels(x, y);

    //YOUR CODE
    //moving the piece to its initial position
    movePieceTo($(piece), pixelPosition.top, pixelPosition.left, socket);
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
    if ($this.hasClass('piece dark') && current_move == black) {
      toggleSelect($this);
    } else if ($this.hasClass('piece light') && current_move == red) {
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

      var $test = $selectedPiece.each(function(index, piece) {
        var position = $(piece).position();
        var coords = getCoords(position.top, position.left);
        var squareIndex = coords.y * 8 + coords.x;
        return $selectedPiece;

      });

      //we only move if there is exactly one selected piece
      if ($selectedPiece.length == 1) {
        //get the index of the square
        //and translate it to pixel position
        var index = $this.prevAll().length;
        var x = index % 8;
        var y = Math.floor(index / 8);
        squareToMoveCords = getCoords(x, y);
        var pixels = getPixels(x, y);

        //actually do the moving

        if ($selectedPiece.hasClass('piece dark')) {
          if (y < selectedPieceCords.y) {
            if (Math.abs(y - selectedPieceCords.y) <= 2) {
              current_move = red;
              movePieceTo($selectedPiece, pixels.top, pixels.left, socket);
            }

          }
        } else {
          if (y > selectedPieceCords.y) {
            if (Math.abs(y - selectedPieceCords.y) <= 2) {
              current_move = black;
              movePieceTo($selectedPiece, pixels.top, pixels.left, socket);
            }
          }
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
