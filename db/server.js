const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(cors());

// Connect to SQLite database
let db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create the table if it doesn't exist and insert sample data
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error("Table creation failed:", err.message);
    } else {
      console.log("Table created or already exists.");

      // Insert sample data
      db.run(`INSERT INTO user (name, email, password) VALUES 
        ('Jonas', 'jonas@gmail.com', '123456'), 
        ('Pietro', 'pietro@gmail.com', '123456')`, (err) => {
        if (err) {
          console.error("Data insertion failed:", err.message);
        } else {
          console.log("Sample data inserted.");
        }
      });
    }
  });
});

// API endpoint to list all users from the database
app.get('/users', (req, res) => {
  db.all('SELECT * FROM user', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to get a user by ID from the database
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FORM user WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    } else if (!row) {
      res.status(404).json({ error: 'User not found'});
      return;
    } else {
      res.json(row);
      res.sendStatus(200);
    }
  });
});

// API endpoint to create a user in the database
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  db.run('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    } else {
      res.sendStatus(201);
    }
  });
});

// API endpoint to update a user in the database
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  db.run('UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    } else {
      res.sendStatus(200);
    }
  });
});

// API endpoint to delete a user in the database
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM user WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
