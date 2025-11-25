const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/animals', (req, res) => {
  try {
    const animals = db.prepare('SELECT * FROM animals').all();
    res.json(animals);
  } catch (error) {
    res.status(500).json({ error: 'Tietokantavirhe' });
  }
});

app.get('/animals/:id', (req, res) => {
  try {
    const animal = db.prepare('SELECT * FROM animals WHERE id = ?').get(req.params.id);
    if (!animal) {
      return res.status(404).json({ error: 'Elainta ei loytynyt' });
    }
    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: 'Tietokantavirhe' });
  }
});

app.listen(PORT, () => {
  console.log(`Server A kaynnissa portissa ${PORT}`);
});
