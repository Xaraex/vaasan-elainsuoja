import { useState, useEffect } from 'react';
import AnimalCard from '../components/AnimalCard';
import './HomePage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function HomePage() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await fetch(`${API_URL}/animals`);
      if (!response.ok) throw new Error('Virhe haettaessa eläimiä');
      const data = await response.json();
      setAnimals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnimals = animals.filter(animal => {
    if (filter === 'all') return true;
    return animal.type === filter;
  });

  if (loading) return <div className="loading">Ladataan eläimiä...</div>;
  if (error) return <div className="error">Virhe: {error}</div>;

  return (
    <div className="home-page">
      <div className="hero">
        <h1>Löydä uusi perheenjäsen</h1>
        <p>Vaasan Eläinsuojasta löydät rakastavia lemmikkejä, jotka etsivät uutta kotia</p>
      </div>

      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Kaikki
        </button>
        <button
          className={filter === 'koira' ? 'active' : ''}
          onClick={() => setFilter('koira')}
        >
          Koirat
        </button>
        <button
          className={filter === 'kissa' ? 'active' : ''}
          onClick={() => setFilter('kissa')}
        >
          Kissat
        </button>
      </div>

      <div className="animals-grid">
        {filteredAnimals.length > 0 ? (
          filteredAnimals.map(animal => (
            <AnimalCard key={animal.id} animal={animal} />
          ))
        ) : (
          <p className="no-animals">Ei eläimiä tässä kategoriassa</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
