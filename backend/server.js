require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();

// Use environment variables for port and database path
const port = process.env.PORT || 3000; // Default to 3000 if not provided in .env
const dbPath = process.env.DATABASE_PATH || './data/db.sqlite'; // Default to './data/db.sqlite' if not provided

// Middleware for JSON parsing and CORS headers
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    next();
});

// Database connection and initialization
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create table for passwords
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        website TEXT,
        username TEXT,
        password TEXT
    )`);
});

// Save password endpoint
app.post('/api/save-password', (req, res) => {
    const { website, username, password } = req.body;

    db.run('INSERT INTO passwords (website, username, password) VALUES (?, ?, ?)', [website, username, password], function (err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saving password' });
        }
        res.json({ success: true });
    });
});

// Get all passwords endpoint
app.get('/api/get-passwords', (req, res) => {
    db.all('SELECT * FROM passwords', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error retrieving passwords' });
        }
        res.json({ success: true, data: rows });
    });
});

// Start server using the port defined in .env
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});