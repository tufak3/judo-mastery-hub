const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const initDatabase = () => {
    const db = new sqlite3.Database(path.join(__dirname, '..', 'judo.db'), (err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            return;
        }
        console.log('Connected to database successfully');

        // Проверяем и пересоздаем таблицу photos если нужно
        db.all("PRAGMA table_info(photos)", [], (err, columns) => {
            if (err) {
                console.error('Error checking photos table:', err);
                return;
            }

            const hasImageColumn = columns.some(col => col.name === 'image');
            if (!hasImageColumn) {
                console.log('Recreating photos table with image column...');
                db.serialize(() => {
                    db.run(`DROP TABLE IF EXISTS photos`, (err) => {
                        if (err) console.error('Error dropping photos table:', err);
                    });

                    db.run(`CREATE TABLE IF NOT EXISTS photos (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        album_id INTEGER NOT NULL,
                        image TEXT NOT NULL,
                        title TEXT,
                        description TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
                    )`, (err) => {
                        if (err) {
                            console.error('Error creating photos table:', err);
                        } else {
                            console.log('Photos table recreated successfully');
                        }
                    });
                });
            } else {
                console.log('Photos table structure is correct');
            }
        });
    });
};

module.exports = initDatabase; 