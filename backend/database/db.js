const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'amadeus.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Ошибка подключения к SQLite:', err.message);
    } else {
        console.log('✅ Подключено к SQLite базе данных');
        initDatabase();
    }
});

// Initialize database tables
function initDatabase() {
    const queries = [
        `CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            message TEXT,
            date TEXT NOT NULL,
            status TEXT DEFAULT 'Новая'
        )`,
        `CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page_views INTEGER DEFAULT 0,
            unique_visitors INTEGER DEFAULT 0,
            last_updated TEXT
        )`
    ];

    db.serialize(() => {
        queries.forEach(query => {
            db.run(query, (err) => {
                if (err) {
                    console.error('Ошибка создания таблицы:', err.message);
                }
            });
        });
        
        // Insert initial stats if not exists
        db.get('SELECT COUNT(*) as count FROM stats', [], (err, row) => {
            if (!err && row.count === 0) {
                db.run('INSERT INTO stats (page_views, unique_visitors, last_updated) VALUES (0, 0, datetime("now"))');
            }
        });
        
        console.log('📊 База данных инициализирована');
    });
}

// Promisify db methods
db.runAsync = function(sql, params = []) {
    return new Promise((resolve, reject) => {
        this.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

db.getAsync = function(sql, params = []) {
    return new Promise((resolve, reject) => {
        this.get(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

db.allAsync = function(sql, params = []) {
    return new Promise((resolve, reject) => {
        this.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

module.exports = db;