function setUpPieces() {
    //select all the divs with class 'piece'
    //add the 'light' class to half of them
    //add the 'dark' to the other half

    var pieceCount = 24;

    for(var i = 0; i<=pieceCount; i++){
      if(i % 2 == 0 ) {
            $('div.piece').eq(i).addClass('light');
        } else {
            $('div.piece').eq(i).addClass('dark');
        }
    }
}

function movePieceTo($piece,newTop,newLeft) {
  $piece.css('top', newTop);
  $piece.css('left', newLeft);
}

function movePieceToAcutalMove($piece,newTop,newLeft) {
    //set the css 'top' and 'left'
    //attributes of the passed piece
    //to the arguments newTop and newLeft
    console.log("Move piece");

    socket.emit('gameStatus', gameCode);

    socket.on('gameStatus', function(status){
      console.log("game status: ", status);

      if(status == true) {
        let gameObj = {nT: newTop, nL: newLeft}
        console.log("Game Object SENT:", gameObj);
        console.log("gameMove Sent!");
        movePieceTo($piece,newTop,newLeft)
        socket.emit('gameMove', gameObj, function (err) {
          if (err) {
            alert(err);
          } else {
            console.log('No error');
          }
        });

      }

    });

    socket.on('gameMove', function(move) {

      console.log("RECIEVE MOVE: " ,move);
      console.log("gameMove Recieved");
      $piece.css('top', move.nT);
      $piece.css('left', move.nL);

    });

    // $piece.css('top', newTop);
    // $piece.css('left', newLeft);
}

function setUpBoard() {
    //iterate through all of the divs
    //with class `square`
    //figure out whether each one should be
    //light or dark, and assign the proper class
    var $squares = $("div.square");

    //heres a helper function that takes a number between
    //0 and 63 (inclusive) and returns 1 if the square should be
    //dark, and 0 if the square should be light
    function lightOrDark(index) {
        var x = index % 8;
        var y = Math.floor(index / 8);
        var oddX = x % 2;
        var oddY = y % 2;
        console.log(oddX ^ oddY);
        return (oddX ^ oddY);

    }

        for (i=0;i<$squares.length;i++) {

        if (lightOrDark(i) == 0) {
            $($squares[i]).addClass("light");
        }
        else {
            $($squares[i]).addClass("dark");
        }
    }
}

function toggleSelect($piece) {
    //if $piece has the class 'selected',
    //remove it

    //if $piece does not have the class 'selected'
    //make sure no other divs with the class 'piece'
    //have that class, then set $piece to have the class
    if($piece.hasClass('selected'))
        $piece.removeClass('selected');
    else {
        $('div.piece').each(function(index,piece)
        {
            if($(piece).hasClass('selected'))
                $(piece).removeClass('selected');
        });
        $piece.addClass('selected');

   }
}

function incrementMoveCount() {
    //gets the html of the span with id
    //moveCount
    //turns it into a number
    //increments it by one
    //sets the html of the span with id moveCount
    //to the new move count
    $('span#moveCount').html(parseInt($('span#moveCount').html(),10)+1);
}
