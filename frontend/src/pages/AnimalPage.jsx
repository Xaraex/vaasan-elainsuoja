import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AnimalPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function AnimalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    message: ''
  });

  useEffect(() => {
    fetchAnimal();
  }, [id]);

  const fetchAnimal = async () => {
    try {
      const response = await fetch(`${API_URL}/animals/${id}`);
      if (!response.ok) throw new Error('Eläintä ei löytynyt');
      const data = await response.json();
      setAnimal(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/animals/${id}/adopt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        navigate('/thank-you', {
          state: {
            animalName: animal.name,
            applicantName: formData.applicant_name
          }
        });
      } else {
        alert(data.error || 'Hakemuksen lähetys epäonnistui');
      }
    } catch (err) {
      alert('Virhe: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Ladataan...</div>;
  if (error) return <div className="error">Virhe: {error}</div>;
  if (!animal) return <div className="error">Eläintä ei löytynyt</div>;

  const placeholderImage = animal.type === 'kissa'
    ? 'https://placekitten.com/600/400'
    : 'https://placedog.net/600/400';

  return (
    <div className="animal-page">
      <div className="animal-detail">
        <div className="animal-image">
          <img
            src={animal.image_url || placeholderImage}
            alt={animal.name}
            onError={(e) => { e.target.src = placeholderImage; }}
          />
        </div>

        <div className="animal-info-section">
          <span className={`status-tag ${animal.status}`}>
            {animal.status === 'available' ? 'Adoptoitavissa' : 'Varattu'}
          </span>

          <h1>{animal.name}</h1>

          <div className="info-grid">
            <div className="info-item">
              <span className="label">Tyyppi</span>
              <span className="value">{animal.type === 'kissa' ? 'Kissa' : 'Koira'}</span>
            </div>
            <div className="info-item">
              <span className="label">Ikä</span>
              <span className="value">{animal.age} vuotta</span>
            </div>
            <div className="info-item">
              <span className="label">Rotu</span>
              <span className="value">{animal.breed}</span>
            </div>
          </div>

          <div className="description">
            <h3>Kuvaus</h3>
            <p>{animal.description}</p>
          </div>

          {animal.status === 'available' && !showForm && (
            <button
              className="adopt-button"
              onClick={() => setShowForm(true)}
            >
              Adoptoi minut
            </button>
          )}

          {animal.status !== 'available' && (
            <p className="unavailable-message">
              Tälle eläimelle on jo jätetty adoptiohakemus.
            </p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="adoption-form-container">
          <h2>Adoptiohakemus - {animal.name}</h2>
          <form onSubmit={handleSubmit} className="adoption-form">
            <div className="form-group">
              <label htmlFor="applicant_name">Nimi *</label>
              <input
                type="text"
                id="applicant_name"
                name="applicant_name"
                value={formData.applicant_name}
                onChange={handleInputChange}
                required
                placeholder="Etunimi Sukunimi"
              />
            </div>

            <div className="form-group">
              <label htmlFor="applicant_email">Sähköposti *</label>
              <input
                type="email"
                id="applicant_email"
                name="applicant_email"
                value={formData.applicant_email}
                onChange={handleInputChange}
                required
                placeholder="esimerkki@email.fi"
              />
            </div>

            <div className="form-group">
              <label htmlFor="applicant_phone">Puhelinnumero *</label>
              <input
                type="tel"
                id="applicant_phone"
                name="applicant_phone"
                value={formData.applicant_phone}
                onChange={handleInputChange}
                required
                placeholder="040 123 4567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Kerro itsestäsi ja kodistasi</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                placeholder="Miksi haluat adoptoida tämän eläimen? Millainen koti sinulla on?"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Peruuta
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={submitting}
              >
                {submitting ? 'Lähetetään...' : 'Lähetä hakemus'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AnimalPage;
