
module.exports = function (io) {

/**
 * Chat console message.
 */
 io.on('connection', function(socket){
   socket.on('game chat', function(msg){
     io.emit('game chat', msg);
   });
 });

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

io.on('connection', function(socket){
  console.log('a user connected: ' + socket.id);
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
};
