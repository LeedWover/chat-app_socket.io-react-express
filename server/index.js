const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log('a user is connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use('/', require('./routes'));

server.listen(port, () => console.log(`Server running on port ${port}!`));
