import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Input, Button } from '@material-ui/core';

const Join = () => {
  const history = useHistory();
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name) return alert('Please enter a name');
    return history.push(`/chat?name=${name}`);
  };

  return (
    <div>
      <Container align="center">
        <h1>Welcome in the chat!</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Enter a name"
              onChange={(event) => setName(event.target.value)}
            />
            <Button type="submit">Sign In</Button>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Join;
