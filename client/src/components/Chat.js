import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

let socket;
const SERVER_URL = 'localhost:5000';

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  
  useEffect(() => {
    const { name } = queryString.parse(location.search);
    socket = io(SERVER_URL);
    setName(name);
  }, [SERVER_URL, location.search]);

  return (
    <div>Dashboard</div>
  );
};

export default Chat;
