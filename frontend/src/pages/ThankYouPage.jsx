import { Link, useLocation } from 'react-router-dom';
import './ThankYouPage.css';

function ThankYouPage() {
  const location = useLocation();
  const { animalName, applicantName } = location.state || {};

  return (
    <div className="thank-you-page">
      <div className="thank-you-card">
        <div className="success-icon">OK</div>
        <h1>Kiitos hakemuksestasi!</h1>

        {animalName && applicantName ? (
          <p className="personalized-message">
            Hei {applicantName}! Olemme vastaanottaneet adoptiohakemuksesi
            koskien eläintä <strong>{animalName}</strong>.
          </p>
        ) : (
          <p>Adoptiohakemuksesi on vastaanotettu onnistuneesti.</p>
        )}

        <div className="next-steps">
          <h3>Mitä seuraavaksi?</h3>
          <ul>
            <li>Käsittelemme hakemuksesi 1-3 arkipäivän kuluessa</li>
            <li>Otamme sinuun yhteyttä sähköpostitse tai puhelimitse</li>
            <li>Sovimme tapaamisen eläinsuojalle</li>
          </ul>
        </div>

        <Link to="/" className="back-button">
          Takaisin eläinlistaan
        </Link>
      </div>
    </div>
  );
}

export default ThankYouPage;
