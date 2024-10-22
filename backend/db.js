const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(process.env.DB_FILE);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);
});

module.exports = db;