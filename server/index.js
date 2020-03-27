const app = require("express")();
var cors = require('cors');
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(cors());

const { addUser, removeUser, getUser, getUsers } = require("./users");

const port = process.env.PORT || 5000;

io.on("connection", socket => {
  socket.on("join", ({ name, room }, cb) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return cb(error);

    socket.emit("message", {
      user: { name: "Admin", room: "room" },
      text: `Üdv itt!`
    });
    socket.broadcast
      .to(room)
      .emit("message", { user: { name: 'Admin', room: 'room' }, text: `${name} belépett.` });
    socket.join(room);
  });

  socket.on("sendMessage", (message, cb) => {
    const user = getUser(socket.id);
    if(user === undefined) {
      return
    }
    io.to(user.room).emit("message", { user, text: message });
    cb();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if(user) io.to(user.room).emit("message", { user: { name: 'Admin' }, text: `${user.name} kilépett.` });
  });
});

app.use("/", require("./routes"));

server.listen(port, () => console.log(`Server running on port ${port}!`));
