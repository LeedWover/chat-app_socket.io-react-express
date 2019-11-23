import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { Container, Input } from '@material-ui/core';
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
    <Container>
      <div style={{margin: '2em', textAlign: 'center'}}>
        <span style={{fontSize: '2em', padding: '1em'}}>{name}</span>
        <a href="/" style={{textDecoration: 'none', fontSize: '2em'}}>Disconnect</a>
      </div>
      <div>
        <Input
          fullWidth={true}
          placeholder="Type something..."
          value={message}
          onChange={event => setMessage(event.target.value)}
          onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
        />
      </div>
      <div>{message}</div>
      <div>{messages.map((message, i) => <div key={i} style={{ margin: '20px 0' }}><span style={{background: 'blue', color: '#fff', padding: '5px 8px', borderRadius: '10px'}} bgcolor="primary.main">{message.user.name}</span> {message.text}</div>)}</div>
    </Container>
  );
};

export default Chat;
