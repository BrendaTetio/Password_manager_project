const sqlite3 = require('sqlite3').verbose();

// Initialize the database with the path from environment variables
const dbPath = new sqlite3.Database(process.env.DB_PATH || './data/db.sqlite', (err) => {
    if (err) {
        console.error('Could not connect to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create tables for users and passwords
db.serialize(() => {
    // Create users table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // Create passwords table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        website TEXT,
        username TEXT,
        password TEXT
    )`);
});

module.exports = dbPath;
