import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Input, Button } from '@material-ui/core';
import queryString from 'query-string';
import io from 'socket.io-client';

let socket;
const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_DEV_SERVER_URL
    : process.env.REACT_APP_PROD_SERVER_URL;

const Chat = ({ location }) => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const { name } = queryString.parse(location.search);
    setName(name);
    socket = io(SERVER_URL);
    socket.emit('join', { name, room: 'room' }, error => {
      setError(error);
      return history.push(`/`);
    });
  }, [location.search]);

  useEffect(() => {
    socket.on('message', message => {
      setMessages([...messages, message]);
      const usersToSet = message.users;
      if(message.users) setUsers(usersToSet);
    });
  }, [messages]);

  const sendMessage = event => {
    event.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  return (
    <Container maxWidth="sm">
      <div style={{ margin: '0.6em' }}>
        <span style={{ fontSize: '2.4em' }}>{name}</span>
        <a
          href="/"
          style={{ textDecoration: 'none', fontSize: '1.2em', float: 'right' }}
        >
          Kilépés
        </a>
      </div>
      <div>
        <div style={{margin: '20px'}}>
         <span>Elérhető:</span>
          {users
            ? users.map((user, i) => (
                <span
                  key={i}
                  style={{
                    background: '#85be00',
                    color: '#fff',
                    padding: '5px 8px',
                    margin: '3px 0 3px 8px',
                    borderRadius: '10px'
                  }}
                >
                  {user.name}
                </span>
              ))
            : null}
        </div>
        <Input
          fullWidth={true}
          placeholder="Írj valamit..."
          value={message}
          onChange={event => setMessage(event.target.value)}
          onKeyPress={event =>
            event.key === 'Enter' ? sendMessage(event) : null
          }
        />
      </div>
      <div>
        {messages.map((message, i) => {
          let color = name === message.user.name ? '#0059ac' : '#6b6b6b';
          const align = name === message.user.name ? 'left' : 'right';
          if (message.user.name.toLowerCase() === 'admin') {
            color = '#c00000';
          }
          return (
            <div key={i} style={{ margin: '20px 0', textAlign: align }}>
              {name === message.user.name ? (
                <>
                  <span
                    style={{
                      background: color,
                      color: '#fff',
                      padding: '5px 8px',
                      borderRadius: '10px'
                    }}
                  >
                    {message.user.name}
                  </span>{' '}
                  <span>{message.text}</span>
                </>
              ) : (
                <>
                  <span>{message.text}</span>{' '}
                  <span
                    style={{
                      background: color,
                      color: '#fff',
                      padding: '5px 8px',
                      borderRadius: '10px'
                    }}
                  >
                    {message.user.name}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
      {error ? alert(error) : null}
    </Container>
  );
};

export default Chat;
