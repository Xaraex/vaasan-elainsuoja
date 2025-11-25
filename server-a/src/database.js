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
    ['Luna', 'kissa', 3, 'Eurooppalainen lyhytkarva', 'Rauhallinen ja hella kissa, joka rakastaa sylissa olemista.', 'https://placekitten.com/400/300', 'available'],
    ['Max', 'koira', 5, 'Labradorinnoutaja', 'Energinen ja leikkisa koira, sopii aktiiviseen perheeseen.', 'https://placedog.net/400/300', 'available'],
    ['Miro', 'kissa', 1, 'Ragdoll', 'Leikkisa pentu, tulee toimeen muiden elainten kanssa.', 'https://placekitten.com/401/300', 'available'],
    ['Bella', 'koira', 2, 'Saksanpaimenkoira', 'Alykas ja uskollinen, tarvitsee kokeneen omistajan.', 'https://placedog.net/401/300', 'available'],
    ['Viivi', 'kissa', 7, 'Persialainen', 'Rauhallinen seniorikissa, sopii rauhalliseen kotiin.', 'https://placekitten.com/402/300', 'available'],
    ['Rocky', 'koira', 4, 'Bulldog', 'Ystavallinen ja rauhallinen, rakastaa lapsia.', 'https://placedog.net/402/300', 'available']
  ];

  animals.forEach(animal => insert.run(...animal));
}

module.exports = db;
