require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const multer = require('multer');
const { processImage, validateImage } = require('./utils/imageUtils');
const initDatabase = require('./utils/dbInit');

const app = express();
const port = process.env.PORT || 3000;

// Инициализация базы данных
initDatabase();

// Конфигурация
const MAX_FILE_SIZE = '50mb';
const allowedOrigins = [
    'https://judo-site-frontend-dfw9.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: MAX_FILE_SIZE }));
app.use(express.urlencoded({ limit: MAX_FILE_SIZE, extended: true }));

// Константы для ограничений
const MAX_IMAGE_WIDTH = 1200; // максимальная ширина изображения
const MAX_IMAGE_HEIGHT = 800; // максимальная высота изображения
const MAX_TEXT_LENGTH = 1000; // максимальная длина текста новости

// Функция для обрезки текста
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Функция для обработки изображений
const resizeImage = async (imageBuffer) => {
    try {
        const processedImage = await sharp(imageBuffer)
            .resize(1920, 1080, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 })
            .toBuffer();
        return processedImage;
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image');
    }
};

// Создаем подключение к базе данных
const db = new sqlite3.Database(path.join(__dirname, 'judo.db'), (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Создаем таблицы, если они не существуют
    db.serialize(() => {
      // Таблица контактов
      db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT DEFAULT 'Не указан',
        phone TEXT DEFAULT 'Не указан',
        worktime TEXT DEFAULT 'Пн-Пт: 9:00-18:00',
        email TEXT DEFAULT '',
        vk TEXT DEFAULT '',
        telegram TEXT DEFAULT '',
        whatsapp TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating contacts table:', err);
        } else {
          // Добавлять дефолтную запись только если таблица пуста
          db.get('SELECT COUNT(*) as count FROM contacts', (err, row) => {
            if (!err && row.count === 0) {
              db.run(`INSERT INTO contacts (address, phone, worktime, email, vk, telegram, whatsapp) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['Не указан', '+79828722356 - Иван\n+79826459212 - Алексей', 'Пн-Пт: 9:00-18:00', '', '', '', ''],
                (err) => {
                  if (err) {
                    console.error('Error creating default contacts:', err);
                  } else {
                    console.log('Default contact created successfully');
                  }
                });
            }
          });
        }
      });

      // Таблица новостей
      db.run(`CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        image TEXT
      )`);

      // Таблица соревнований
      db.run(`CREATE TABLE IF NOT EXISTS competitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL,
        registrationDeadline TEXT,
        requirements TEXT,
        image TEXT
      )`);

      // Таблица обучения
      db.run(`CREATE TABLE IF NOT EXISTS learning (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        instructor TEXT NOT NULL,
        schedule TEXT NOT NULL,
        level TEXT NOT NULL,
        maxParticipants INTEGER,
        currentParticipants INTEGER DEFAULT 0,
        price TEXT,
        image TEXT
      )`);

      // Создание таблицы для альбомов
      db.run(`CREATE TABLE IF NOT EXISTS albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Создание таблицы для фотографий
      db.run(`DROP TABLE IF EXISTS photos`);
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
          console.log('Photos table created successfully');
        }
      });

      // Создание таблицы для событий календаря
      db.run(`CREATE TABLE IF NOT EXISTS calendar_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        type TEXT NOT NULL -- 'competition' или 'festival'
      )`);

      // Таблица партнеров
      db.run(`CREATE TABLE IF NOT EXISTS partners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        image TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
    });
  }
});

// API endpoints для новостей
app.get('/api/news', (req, res) => {
  db.all('SELECT * FROM news ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/news/published', (req, res) => {
  db.all('SELECT * FROM news WHERE status = ? ORDER BY date DESC', ['published'], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/news', async (req, res) => {
  try {
    const { title, content, date, status, image } = req.body;
    
    // Обрезаем текст, если он превышает максимальную длину
    const truncatedContent = truncateText(content, MAX_TEXT_LENGTH);
    
    // Если есть изображение, изменяем его размер
    let processedImage = image;
    if (image) {
      const imageBuffer = Buffer.from(image.split(',')[1], 'base64');
      processedImage = await resizeImage(imageBuffer);
      processedImage = 'data:image/jpeg;base64,' + processedImage.toString('base64');
    }

    db.run(
      'INSERT INTO news (title, content, date, status, image) VALUES (?, ?, ?, ?, ?)',
      [title, truncatedContent, date, status, processedImage],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          id: this.lastID,
          title,
          content: truncatedContent,
          date,
          status,
          image: processedImage
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/news/:id', async (req, res) => {
  try {
    const { title, content, date, status, image } = req.body;
    
    // Обрезаем текст, если он превышает максимальную длину
    const truncatedContent = truncateText(content, MAX_TEXT_LENGTH);
    
    // Если есть новое изображение, изменяем его размер
    let processedImage = image;
    if (image && image.startsWith('data:image')) {
      const imageBuffer = Buffer.from(image.split(',')[1], 'base64');
      processedImage = await resizeImage(imageBuffer);
      processedImage = 'data:image/jpeg;base64,' + processedImage.toString('base64');
    }

    db.run(
      'UPDATE news SET title = ?, content = ?, date = ?, status = ?, image = ? WHERE id = ?',
      [title, truncatedContent, date, status, processedImage, req.params.id],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        if (this.changes === 0) {
          res.status(404).json({ error: 'News not found' });
          return;
        }
        res.json({
          id: req.params.id,
          title,
          content: truncatedContent,
          date,
          status,
          image: processedImage
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/news/:id', (req, res) => {
  db.run('DELETE FROM news WHERE id = ?', req.params.id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'News not found' });
      return;
    }
    res.json({ message: 'News deleted successfully' });
  });
});

// API endpoints для контактов
app.get('/api/contacts', (req, res) => {
  db.get("SELECT * FROM contacts", [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row || {
      address: 'Не указан',
      phone: 'Не указан',
      worktime: 'Пн-Пт: 9:00-18:00',
      email: '',
      vk: '',
      telegram: '',
      whatsapp: ''
    });
  });
});

// app.post('/api/contacts', (req, res) => {
//   const { name, position, phone, email, image } = req.body;
//   db.run(
//     'INSERT INTO contacts (name, position, phone, email, image) VALUES (?, ?, ?, ?, ?)',
//     [name, position, phone, email, image],
//     function(err) {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }
//       res.json({
//         id: this.lastID,
//         name,
//         position,
//         phone,
//         email,
//         image
//       });
//     }
//   );
// });

app.put('/api/contacts', (req, res) => {
  // Фильтруем только разрешённые поля
  const allowedFields = ['address', 'phone', 'worktime', 'email', 'vk', 'telegram', 'whatsapp'];
  const updateData = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });
  const { address, phone, worktime, email, vk, telegram, whatsapp } = updateData;
  const updateTime = new Date().toISOString();

  db.run(
    `UPDATE contacts SET 
      address = COALESCE(?, address),
      phone = COALESCE(?, phone),
      worktime = COALESCE(?, worktime),
      email = COALESCE(?, email),
      vk = COALESCE(?, vk),
      telegram = COALESCE(?, telegram),
      whatsapp = COALESCE(?, whatsapp),
      updated_at = ?
     WHERE id = (SELECT MIN(id) FROM contacts)`,
    [address, phone, worktime, email, vk, telegram, whatsapp, updateTime],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      db.get("SELECT * FROM contacts", [], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(row);
      });
    }
  );
});

app.put('/api/contacts/:field', (req, res) => {
  const { field } = req.params;
  const { value } = req.body;
  const updateTime = new Date().toISOString();

  // Проверяем, что поле существует
  const allowedFields = ['address', 'phone', 'worktime', 'email', 'vk', 'telegram', 'whatsapp'];
  if (!allowedFields.includes(field)) {
    res.status(400).json({ error: 'Недопустимое поле' });
    return;
  }

  db.run(
    `UPDATE contacts SET ${field} = ?, updated_at = ? WHERE id = (SELECT MIN(id) FROM contacts)`,
    [value, updateTime],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      db.get("SELECT * FROM contacts", [], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(row);
      });
    }
  );
});

app.delete('/api/contacts/:id', (req, res) => {
  db.run('DELETE FROM contacts WHERE id = ?', req.params.id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    res.json({ message: 'Contact deleted successfully' });
  });
});

// API endpoints для соревнований
app.get('/api/competitions', (req, res) => {
  db.all('SELECT * FROM competitions ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/competitions/active', (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0];
  db.all(
    'SELECT * FROM competitions WHERE date >= ? AND status = ? ORDER BY date ASC',
    [currentDate, 'active'],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

app.post('/api/competitions', (req, res) => {
  const { title, description, date, location, status, registrationDeadline, requirements, image } = req.body;
  db.run(
    'INSERT INTO competitions (title, description, date, location, status, registrationDeadline, requirements, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title, description, date, location, status, registrationDeadline, requirements, image],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        title,
        description,
        date,
        location,
        status,
        registrationDeadline,
        requirements,
        image
      });
    }
  );
});

app.put('/api/competitions/:id', (req, res) => {
  const { title, description, date, location, status, registrationDeadline, requirements, image } = req.body;
  db.run(
    'UPDATE competitions SET title = ?, description = ?, date = ?, location = ?, status = ?, registrationDeadline = ?, requirements = ?, image = ? WHERE id = ?',
    [title, description, date, location, status, registrationDeadline, requirements, image, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Competition not found' });
        return;
      }
      res.json({
        id: req.params.id,
        title,
        description,
        date,
        location,
        status,
        registrationDeadline,
        requirements,
        image
      });
    }
  );
});

app.delete('/api/competitions/:id', (req, res) => {
  db.run('DELETE FROM competitions WHERE id = ?', req.params.id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Competition not found' });
      return;
    }
    res.json({ message: 'Competition deleted successfully' });
  });
});

// API endpoints для обучения
app.get('/api/learning', (req, res) => {
  db.all('SELECT * FROM learning', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/learning', (req, res) => {
  const { title, description, instructor, schedule, level, maxParticipants, currentParticipants, price, image } = req.body;
  db.run(
    'INSERT INTO learning (title, description, instructor, schedule, level, maxParticipants, currentParticipants, price, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, description, instructor, schedule, level, maxParticipants, currentParticipants, price, image],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        title,
        description,
        instructor,
        schedule,
        level,
        maxParticipants,
        currentParticipants,
        price,
        image
      });
    }
  );
});

app.put('/api/learning/:id', (req, res) => {
  const { title, description, instructor, schedule, level, maxParticipants, currentParticipants, price, image } = req.body;
  db.run(
    'UPDATE learning SET title = ?, description = ?, instructor = ?, schedule = ?, level = ?, maxParticipants = ?, currentParticipants = ?, price = ?, image = ? WHERE id = ?',
    [title, description, instructor, schedule, level, maxParticipants, currentParticipants, price, image, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Learning course not found' });
        return;
      }
      res.json({
        id: req.params.id,
        title,
        description,
        instructor,
        schedule,
        level,
        maxParticipants,
        currentParticipants,
        price,
        image
      });
    }
  );
});

app.delete('/api/learning/:id', (req, res) => {
  db.run('DELETE FROM learning WHERE id = ?', req.params.id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Learning course not found' });
      return;
    }
    res.json({ message: 'Learning course deleted successfully' });
  });
});

// API для работы с альбомами
app.get('/api/albums', (req, res) => {
    db.all('SELECT * FROM albums ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/albums', (req, res) => {
    const { title, description } = req.body;
    db.run('INSERT INTO albums (title, description) VALUES (?, ?)',
        [title, description],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        });
});

// API для работы с фотографиями
app.get('/api/photos', (req, res) => {
    db.all('SELECT p.*, a.title as album_title FROM photos p LEFT JOIN albums a ON p.album_id = a.id ORDER BY p.created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Error fetching photos:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/photos/:albumId', (req, res) => {
    const { albumId } = req.params;
    if (!albumId) {
        res.status(400).json({ error: 'Album ID is required' });
        return;
    }
    db.all('SELECT * FROM photos WHERE album_id = ? ORDER BY created_at DESC', [albumId], (err, rows) => {
        if (err) {
            console.error('Error fetching photos for album:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/photos', async (req, res) => {
    try {
        const { album_id, image, title, description } = req.body;
        
        if (!album_id || !image) {
            return res.status(400).json({ error: 'Не выбран альбом или изображение' });
        }

        // Проверяем структуру таблицы
        db.all("PRAGMA table_info(photos)", [], (err, columns) => {
            if (err) {
                console.error('Error checking table structure:', err);
            } else {
                console.log('Photos table structure:', columns);
            }
        });

        // Проверяем существование альбома
        const albumExists = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM albums WHERE id = ?', [album_id], (err, row) => {
                if (err) reject(err);
                resolve(row !== undefined);
            });
        });

        if (!albumExists) {
            return res.status(404).json({ error: 'Альбом не найден' });
        }

        // Валидация и обработка изображения
        try {
            validateImage(image);
            const processedImage = await processImage(image);

            // Логируем запрос
            console.log('Inserting photo with album_id:', album_id);
            console.log('Image data length:', processedImage.length);

            // Сохранение в базу данных
            db.run(
                'INSERT INTO photos (album_id, image, title, description) VALUES (?, ?, ?, ?)',
                [album_id, processedImage, title || '', description || ''],
                function(err) {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Ошибка при сохранении фотографии' });
                    }
                    console.log('Photo inserted successfully with id:', this.lastID);
                    res.json({ 
                        id: this.lastID,
                        album_id,
                        image: processedImage,
                        title: title || '',
                        description: description || ''
                    });
                }
            );
        } catch (error) {
            console.error('Image processing error:', error);
            return res.status(400).json({ error: error.message });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Удаление альбома
app.delete('/api/albums/:id', (req, res) => {
  const albumId = req.params.id;
  db.run('DELETE FROM albums WHERE id = ?', [albumId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// Удаление фото
app.delete('/api/photos/:id', (req, res) => {
  const photoId = req.params.id;
  db.run('DELETE FROM photos WHERE id = ?', [photoId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// API для событий календаря
app.get('/api/calendar-events', (req, res) => {
  db.all('SELECT * FROM calendar_events ORDER BY date ASC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/calendar-events', (req, res) => {
  const { date, type } = req.body;
  if (!date || !type) {
    return res.status(400).json({ error: 'Дата и тип обязательны' });
  }
  db.run('INSERT INTO calendar_events (date, type) VALUES (?, ?)', [date, type], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, date, type });
  });
});

app.delete('/api/calendar-events/:id', (req, res) => {
  db.run('DELETE FROM calendar_events WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// API endpoints для партнеров
app.get('/api/partners', (req, res) => {
  db.all('SELECT * FROM partners ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/partners', async (req, res) => {
  try {
    const { name, image } = req.body;
    
    db.run(
      'INSERT INTO partners (name, image) VALUES (?, ?)',
      [name, image],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          id: this.lastID,
          name,
          image
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/partners/:id', async (req, res) => {
  try {
    const { name, image } = req.body;
    const { id } = req.params;

    const updateQuery = image 
      ? 'UPDATE partners SET name = ?, image = ? WHERE id = ?'
      : 'UPDATE partners SET name = ? WHERE id = ?';
    const updateParams = image 
      ? [name, image, id]
      : [name, id];

    db.run(updateQuery, updateParams, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Partner not found' });
        return;
      }
      res.json({
        id: parseInt(id),
        name,
        image: image || undefined
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/partners/:id', (req, res) => {
  const { id } = req.params;

  // Сначала получаем информацию о партнере для удаления изображения
  db.get('SELECT image FROM partners WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Удаляем запись из базы данных
    db.run('DELETE FROM partners WHERE id = ?', [id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Partner not found' });
        return;
      }

      // Если есть изображение, удаляем его
      if (row && row.image) {
        const imagePath = path.join(__dirname, row.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      res.json({ message: 'Partner deleted successfully' });
    });
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Port:', process.env.PORT);
  console.log('CORS Origin:', process.env.CORS_ORIGIN);
}); 