const express = require('express');
const cors = require('cors');
const axios = require('axios');
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
      return res.status(404).json({ error: 'Eläintä ei löytynyt' });
    }
    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: 'Tietokantavirhe' });
  }
});

const SERVER_B_URL = process.env.SERVER_B_URL || 'http://localhost:3002';

app.post('/animals/:id/adopt', async (req, res) => {
  try {
    const animalId = parseInt(req.params.id);
    const { applicant_name, applicant_email, applicant_phone, message } = req.body;

    const animal = db.prepare('SELECT * FROM animals WHERE id = ?').get(animalId);

    if (!animal) {
      return res.status(404).json({
        success: false,
        error: 'Eläintä ei löytynyt'
      });
    }

    if (animal.status !== 'available') {
      return res.status(409).json({
        success: false,
        error: 'Tämä eläin ei ole enää adoptoitavissa'
      });
    }

    const adoptionData = {
      animal_id: animalId,
      applicant_name,
      applicant_email,
      applicant_phone,
      message
    };

    const response = await axios.post(`${SERVER_B_URL}/adoptions`, adoptionData);

    if (response.data.success) {
      db.prepare('UPDATE animals SET status = ? WHERE id = ?').run('pending', animalId);

      res.status(201).json({
        success: true,
        message: 'Adoptiohakemus lähetetty onnistuneesti',
        adoption_id: response.data.adoption_id,
        animal_name: animal.name
      });
    } else {
      res.status(400).json(response.data);
    }

  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({
      success: false,
      error: 'Adoptiohakemuksen käsittelyssä tapahtui virhe'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'server-a' });
});

app.listen(PORT, () => {
  console.log(`Server A käynnissä portissa ${PORT}`);
});
