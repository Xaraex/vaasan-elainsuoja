const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../data/animals.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS animals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    age INTEGER NOT NULL,
    breed TEXT,
    description TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'available'
  )
`);

const count = db.prepare('SELECT COUNT(*) as count FROM animals').get();

if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO animals (name, type, age, breed, description, image_url, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const animals = [
    ['Luna', 'kissa', 3, 'Eurooppalainen lyhytkarva', 'Rauhallinen ja hellä kissa, joka rakastaa sylissä olemista.', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop', 'available'],
    ['Max', 'koira', 5, 'Labradorinnoutaja', 'Energinen ja leikkisä koira, sopii aktiiviseen perheeseen.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop', 'available'],
    ['Miro', 'kissa', 1, 'Ragdoll', 'Leikkisä pentu, tulee toimeen muiden eläinten kanssa.', 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=300&fit=crop', 'available'],
    ['Bella', 'koira', 2, 'Saksanpaimenkoira', 'Älykäs ja uskollinen, tarvitsee kokeneen omistajan.', 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop', 'available'],
    ['Viivi', 'kissa', 7, 'Persialainen', 'Rauhallinen seniorikissa, sopii rauhalliseen kotiin.', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop', 'available'],
    ['Rocky', 'koira', 4, 'Bulldog', 'Ystävällinen ja rauhallinen, rakastaa lapsia.', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop', 'available']
  ];

  animals.forEach(animal => insert.run(...animal));
}

module.exports = db;
