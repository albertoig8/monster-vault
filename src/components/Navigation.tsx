import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className={`nav-link ${isActive('/')}`}>
          Home
        </Link>
        <Link to="/catalog" className={`nav-link ${isActive('/catalog')}`}>
          Catálogo
        </Link>
        <Link to="/collection" className={`nav-link ${isActive('/collection')}`}>
          Minha Coleção
        </Link>
        <Link to="/wishlist" className={`nav-link ${isActive('/wishlist')}`}>
          Wishlist
        </Link>
      </div>
    </nav>
  );
}
