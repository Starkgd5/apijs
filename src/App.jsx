import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  // lists data from database
  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // retrieves data from database
  const userRetrieve = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
  }

  // inserts data into database
  const userCreate = async () => {
    const response = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      // data password hashed
      password: await bcrypt.hash(data.password, 10),
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: password
      })
    })
  }

  // updates data in data base
  const userUpdate = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      }
    })
  }

  // deletes data from database
  const userDelete = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      }
    })
  }


  return (
    <div className="App">
      <h1>Data from SQLite Database</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}><a href={`/users/${item.id}`}>{item.name}</a> - {item.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
