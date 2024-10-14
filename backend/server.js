const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow cross-origin requests
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  next();
});

// Initialize SQLite Database
const db = new sqlite3.Database('./db.sqlite');
db.run('CREATE TABLE IF NOT EXISTS passwords (website TEXT, username TEXT, password TEXT)');

// Save password to the database
app.post('/api/save-password', (req, res) => {
  const { website, username, password } = req.body;

  db.run('INSERT INTO passwords (website, username, password) VALUES (?, ?, ?)', [website, username, password], function (err) {
    if (err) {
      res.json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

// Delete password from the database
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});