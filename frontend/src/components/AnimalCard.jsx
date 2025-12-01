import { Link } from 'react-router-dom';
import './AnimalCard.css';

function AnimalCard({ animal }) {
  const placeholderImage = animal.type === 'kissa'
    ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop'
    : 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop';

  return (
    <div className="animal-card">
      <div className="card-image">
        <img
          src={animal.image_url || placeholderImage}
          alt={animal.name}
          onError={(e) => { e.target.src = placeholderImage; }}
        />
        <span className={`status-badge ${animal.status}`}>
          {animal.status === 'available' ? 'Adoptoitavissa' : 'Varattu'}
        </span>
      </div>
      <div className="card-content">
        <h3>{animal.name}</h3>
        <p className="animal-info">
          {animal.type} - {animal.age} v.
        </p>
        <p className="animal-breed">{animal.breed}</p>
        <Link to={`/animal/${animal.id}`} className="view-button">
          Katso lisää
        </Link>
      </div>
    </div>
  );
}

export default AnimalCard;
