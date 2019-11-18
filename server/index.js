const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { addUser, removeUser, getUser } = require('./users');

const port = process.env.PORT || 5000;

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }) => {
    const user = addUser({ id: socket.id, name, room });
    console.log(user)
    socket.emit('sendMessage', { user: 'Admin', text: `Welcome in the chat`});
    socket.broadcast.to(room).emit('sendMessage', { user: user.name, text: `${name} has joined.`});
    socket.join(room);
  });

  socket.on('sendMessage', (message, cb) => {
    const user = getUser(socket.id);
    console.log('user', user)
    io.to(user.room).emit('sendMessage', { user, text: message });
    cb();
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use('/', require('./routes'));

server.listen(port, () => console.log(`Server running on port ${port}!`));
