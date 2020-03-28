const app = require("express")();
const cors = require('cors');
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cookie: false });

app.use(cors());

const { addUser, removeUser, getUser, getUsers } = require("./users");

const port = process.env.PORT || 5000;

io.on("connection", socket => {
  
  socket.on("join", ({ name, room }, cb) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    const {users} = getUsers()
    if (error) return cb(error);
    
    socket.emit("message", {
      user: { name: "Admin", room: "room" },
      text: `Üdv itt!`,
      users
    });
    
    socket.broadcast
      .to(room)
      .emit("message", { user: { name: 'Admin', room: 'room' }, text: `${name} belépett.`, users });
    socket.join(room);
  });

  socket.on("sendMessage", (message, cb) => {
    const {users} = getUsers();
    const user = getUser(socket.id);
    if(user === undefined) {
      return
    }
    io.to(user.room).emit("message", { user, text: message }, users);
    cb();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    const {users} = getUsers();
    if(user) io.to(user.room).emit("message", { user: { name: 'Admin' }, text: `${user.name} kilépett.`, users });
  });
});

app.use("/", require("./routes"));

server.listen(port, () => console.log(`Server running on port ${port}!`));
