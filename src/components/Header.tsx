import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/firebase/auth';
import './Header.css';

export default function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>🔥 Monster Vault</h1>
        </div>
        <div className="user-info">
          {userEmail ? (
            <>
              <span className="email">{userEmail}</span>
              <button onClick={handleLogout} className="logout-btn">
                Sair
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
