import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/firebase/auth';
import { collectionService } from '../services/collection/collectionService';
import type { CollectionStats, MonsterCan } from '../types';
import './Home.css';

export default function Home() {
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [recentCans, setRecentCans] = useState<(any & { can: MonsterCan })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const loadStats = async () => {
      try {
        setLoading(true);
        const userStats = await collectionService.getCollectionStats(user.uid);
        setStats(userStats);

        const recent = await collectionService.getRecentlyAdded(user.uid);
        setRecentCans(recent);
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [navigate]);

  if (!authService.getCurrentUser()) {
    return null;
  }

  if (loading) {
    return (
      <div className="home">
        <p className="loading">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="welcome-section">
        <h1>Bem-vindo ao Monster Vault</h1>
        <p>Gerencie sua coleção de Monster Energy</p>
      </div>

      {stats && (
        <div className="stats-section">
          <h2>Sua Coleção</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalCans}</div>
              <div className="stat-label">Latas Total</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.uniqueCans}</div>
              <div className="stat-label">Latas Únicas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.flavors}</div>
              <div className="stat-label">Sabores Diferentes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.countries}</div>
              <div className="stat-label">Países</div>
            </div>
          </div>

          <div className="progress-section">
            <h3>Progresso da Coleção</h3>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(stats.uniqueCans / 200) * 100}%` }}></div>
              </div>
              <p className="progress-text">{stats.uniqueCans} / 200 latas conhecidas</p>
            </div>
          </div>
        </div>
      )}

      {recentCans.length > 0 && (
        <div className="recent-section">
          <h2>Adicionadas Recentemente</h2>
          <div className="recent-cans-grid">
            {recentCans.map((item) => (
              <div key={item.canId} className="recent-can-card">
                <div className="can-image-container">
                  {item.can.imageUrl ? (
                    <img src={item.can.imageUrl} alt={item.can.name} />
                  ) : (
                    <div className="no-image">Sem imagem</div>
                  )}
                </div>
                <div className="can-info">
                  <h4>{item.can.name}</h4>
                  <p className="flavor">{item.can.flavor}</p>
                  <p className="quantity">Quantidade: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats && stats.uniqueCans === 0 && (
        <div className="empty-state">
          <p>Sua coleção está vazia.</p>
          <button onClick={() => navigate('/catalog')} className="cta-button">
            Explorar Catálogo
          </button>
        </div>
      )}
    </div>
  );
}
