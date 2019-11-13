import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

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
      <div>
        <h1>Chat app</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter a name"
              onChange={(event) => setName(event.target.value)}
            />
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Join;
