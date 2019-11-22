const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  const userIsAlreadyExist = users.find((user) => user.name === name);
  if(userIsAlreadyExist) return { error: 'Username is already taken' };

  const user = { id, name, room };
  users.push(user);
  console.log(users)
  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index) return users.splice(index, 1)[0];
}

const getUser = (id) => {
  return users.find((user) => user.id === id);
}

module.exports = {
  addUser,
  removeUser,
  getUser
}
