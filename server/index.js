const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const { addUser, removeUser, getUser, getUsers } = require("./users");

const port = process.env.PORT || 5000;

io.on("connection", socket => {
  socket.on("join", ({ name, room }, cb) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return cb(error);

    socket.emit("message", {
      user: { name: "Admin", room: "room" },
      text: `Welcome in the chat`
    });
    socket.broadcast
      .to(room)
      .emit("message", { user: { name }, text: ` has joined.` });
    socket.join(room);
  });

  socket.on("sendMessage", (message, cb) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user, text: message });
    cb();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if(user) io.to(user.room).emit("message", { user: { name: 'Admin' }, text: `${user.name} has left.` });
  });
});

app.use("/", require("./routes"));

server.listen(port, () => console.log(`Server running on port ${port}!`));
