import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import queryString from "query-string";
import io from "socket.io-client";

let socket;
const SERVER_URL = "localhost:5000";

const Chat = ({ location }) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(messages)
  useEffect(() => {
    const { name } = queryString.parse(location.search);
    setName(name);
    socket = io(SERVER_URL);
    socket.emit("join", { name, room: 'room' }, (error) => {
      console.log(error)
      return history.push(`/`);
    });
    
  }, [SERVER_URL, location.search]);

  useEffect(() => {
    socket.on("message", message => {
      console.log('messs',message)
      setMessages([...messages, message]);
    });
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();
    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }


  return (
    <div>
      <div>
        <span>{name}</span>
        <a href="/">Disconnect</a>
      </div>
      <div>
        <input
          value={message}
          onChange={event => setMessage(event.target.value)}
          onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
        />
      </div>
      <div>{message}</div>
      <div>{messages.map((message, i) => <div key={i}>{message.user.name} {message.text}</div>)}</div>
    </div>
  );
};

export default Chat;
