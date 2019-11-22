import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import queryString from "query-string";
import io from "socket.io-client";

let socket;
const SERVER_URL = "localhost:5000";

const Chat = ({ location }) => {
  const history = useHistory();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { name } = queryString.parse(location.search);
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
        <span>Name</span>
        <button onClick={() => history.push(`/`)}>Disconnect</button>
      </div>
      <div>
        <input
          value={message}
          onChange={event => setMessage(event.target.value)}
          onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
        />
      </div>
      <div>{message}</div>
      <div>{messages.map((message, i) => <div key={i}>{message.text}</div>)}</div>
    </div>
  );
};

export default Chat;
