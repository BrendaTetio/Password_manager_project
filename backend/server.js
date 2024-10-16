const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
let bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware for JSON parsing and CORS headers
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  next();
});

// Database connection and initialization
const db = new sqlite3.Database('./data/db.sqlite', (err) => {
  if (err) {
    console.error('Could not connect to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Users and passwords table creation
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS passwords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      website TEXT,
      username TEXT,
      password TEXT
  )`);
});

// User registration endpoint
app.post('/api/register', [
  check('username').not().isEmpty().withMessage('Username is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'User already exists or database error' });
      }
      res.status(201).json({ success: true, message: 'User registered successfully' });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
});

// User login endpoint
app.post('/api/login', [
  check('username').not().isEmpty().withMessage('Username is required'),
  check('password').not().isEmpty().withMessage('Password is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid username or password' });
    }
  });
});

// Save password endpoint with bcrypt hashing
app.post('/api/save-password', (req, res) => {
  const { website, username, password } = req.body;

  // Hash the password before saving
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error hashing password' });
    }

    // Save the website, username, and hashed password to the database
    db.run('INSERT INTO passwords (website, username, password) VALUES (?, ?, ?)', [website, username, hashedPassword], function (err) {
      if (err) {
        res.status(500).json({ success: false, message: 'Error saving password' });
      } else {
        res.json({ success: true });
      }
    });
  });
});

// Delete password endpoint
app.delete('/api/delete-password', (req, res) => {
  const { website } = req.body;

  db.run('DELETE FROM passwords WHERE website = ?', [website], function (err) {
    if (err) {
      res.json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

// Server listening on specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});