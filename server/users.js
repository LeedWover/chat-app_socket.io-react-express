const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim();
  const userIsAlreadyExist = users.find((user) => user.name === name);
  if(userIsAlreadyExist) return { error: 'Username is already taken' };

  const user = { id, name, room };
  users.push(user);
  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  const removedUser = users[index];
  if(index !== -1) users.splice(index, 1);
  return removedUser;
}

const getUser = (id) => {
  return users.find((user) => user.id === id);
}

const getUsers = () => {
  return {users};
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsers
}
