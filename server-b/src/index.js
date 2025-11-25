const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.post('/adoptions', (req, res) => {
  try {
    const { animal_id, applicant_name, applicant_email, applicant_phone, message } = req.body;

    if (!animal_id || !applicant_name || !applicant_email || !applicant_phone) {
      return res.status(400).json({
        success: false,
        error: 'Kaikki pakolliset kentät tulee täyttää'
      });
    }

    const existingAdoption = db.prepare(
      'SELECT * FROM adoptions WHERE animal_id = ?'
    ).get(animal_id);

    if (existingAdoption) {
      return res.status(409).json({
        success: false,
        error: 'Tälle eläimelle on jo jätetty adoptiohakemus'
      });
    }

    const result = db.prepare(`
      INSERT INTO adoptions (animal_id, applicant_name, applicant_email, applicant_phone, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(animal_id, applicant_name, applicant_email, applicant_phone, message || '');

    res.status(201).json({
      success: true,
      adoption_id: result.lastInsertRowid,
      message: 'Adoptiohakemus vastaanotettu onnistuneesti'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Palvelinvirhe'
    });
  }
});

app.get('/adoptions', (req, res) => {
  try {
    const adoptions = db.prepare('SELECT * FROM adoptions ORDER BY created_at DESC').all();
    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ error: 'Tietokantavirhe' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'server-b' });
});

app.listen(PORT, () => {
  console.log(`Server B käynnissä portissa ${PORT}`);
});
