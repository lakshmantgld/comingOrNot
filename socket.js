var io = require('socket.io')();

io.on('connection', (socket) => {
  // TODO: write something for websocket communication
  //socket.on('message', (message) => {
  //  console.log('s:', message);
  //});
});

module.exports = io;
