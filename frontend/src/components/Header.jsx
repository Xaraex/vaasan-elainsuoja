import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Vaasan Eläinsuoja
        </Link>
        <nav>
          <Link to="/">Adoptoitavat eläimet</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
