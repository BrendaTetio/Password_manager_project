const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const db = new sqlite3.Database('./data/database.db');

// Middleware to handle JSON requests and serve static files
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Initialize SQLite database with table
db.run(`
    CREATE TABLE IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        website TEXT NOT NULL,
        password TEXT NOT NULL
    );
`);

// Route to handle adding a password (POST request)
app.post('/add-password', (req, res) => {
    const { website, password } = req.body;
    
    if (!website || !password) {
        return res.status(400).send('Website and password are required.');
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert into database
    db.run('INSERT INTO passwords (website, password) VALUES (?, ?)', [website, hashedPassword], function (err) {
        if (err) {
            return res.status(500).send('Error saving password');
        }
        res.status(200).send('Password saved successfully!');
    });
});

// Route to fetch all saved passwords (GET request)
app.get('/passwords', (req, res) => {
    db.all('SELECT website, password FROM passwords', [], (err, rows) => {
        if (err) {
            return res.status(500).send('Error retrieving passwords');
        }
        res.status(200).json(rows);
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});