import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Input, Button } from '@material-ui/core';

const Join = () => {
  const history = useHistory();
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name) return alert('Nem írtál be nevet');
    return history.push(`/chat?name=${name}`);
  };

  return (
    <div>
      <Container align="center">
        <h1>Üdv a chatben!</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Írj be egy nevet..."
              onChange={(event) => setName(event.target.value)}
            />
            <Button type="submit">Belépés</Button>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Join;
