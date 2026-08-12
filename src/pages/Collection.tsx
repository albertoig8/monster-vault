import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/firebase/auth';
import { collectionService } from '../services/collection/collectionService';
import type { CollectionStats, MonsterCan } from '../types';
import './Collection.css';

interface CollectionItemWithCan {
  canId: string;
  quantity: number;
  addedAt: any;
  notes?: string;
  can: MonsterCan;
}

export default function Collection() {
  const [items, setItems] = useState<CollectionItemWithCan[]>([]);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const loadCollection = async () => {
      try {
        setLoading(true);
        const collectionItems = await collectionService.getUserCollection(user.uid);
        setItems(collectionItems);

        const collectionStats = await collectionService.getCollectionStats(user.uid);
        setStats(collectionStats);
      } catch (err) {
        console.error('Erro ao carregar coleção:', err);
        setError('Erro ao carregar coleção');
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [navigate]);

  const handleIncreaseQuantity = async (canId: string, currentQuantity: number) => {
    const user = authService.getCurrentUser();
    if (!user) return;

    try {
      await collectionService.incrementQuantity(user.uid, canId, 1);
      setItems(
        items.map((item) =>
          item.canId === canId ? { ...item, quantity: currentQuantity + 1 } : item
        )
      );
    } catch (err) {
      console.error('Erro ao incrementar quantidade:', err);
      setError('Erro ao incrementar quantidade');
    }
  };

  const handleDecreaseQuantity = async (canId: string, currentQuantity: number) => {
    const user = authService.getCurrentUser();
    if (!user) return;

    if (currentQuantity <= 1) {
      await handleRemove(canId);
      return;
    }

    try {
      await collectionService.incrementQuantity(user.uid, canId, -1);
      setItems(
        items.map((item) =>
          item.canId === canId ? { ...item, quantity: currentQuantity - 1 } : item
        )
      );
    } catch (err) {
      console.error('Erro ao decrementar quantidade:', err);
      setError('Erro ao decrementar quantidade');
    }
  };

  const handleRemove = async (canId: string) => {
    const user = authService.getCurrentUser();
    if (!user) return;

    try {
      await collectionService.removeFromCollection(user.uid, canId);
      setItems(items.filter((item) => item.canId !== canId));
    } catch (err) {
      console.error('Erro ao remover:', err);
      setError('Erro ao remover da coleção');
    }
  };

  if (!authService.getCurrentUser()) {
    return null;
  }

  if (loading) {
    return (
      <div className="collection">
        <p className="loading">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="collection">
      <div className="collection-header">
        <h1>Minha Coleção</h1>
        {stats && (
          <div className="stats-summary">
            <div className="stat">
              <span className="stat-value">{stats.totalCans}</span>
              <span className="stat-label">Latas Total</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.uniqueCans}</span>
              <span className="stat-label">Latas Únicas</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.duplicates}</span>
              <span className="stat-label">Duplicatas</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.flavors}</span>
              <span className="stat-label">Sabores</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.countries}</span>
              <span className="stat-label">Países</span>
            </div>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Sua coleção está vazia.</p>
          <button onClick={() => navigate('/catalog')} className="cta-button">
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="collection-grid">
          {items.map((item) => (
            <div key={item.canId} className="collection-card">
              <div className="can-image-container">
                {item.can.imageUrl ? (
                  <img src={item.can.imageUrl} alt={item.can.name} />
                ) : (
                  <div className="no-image">Sem imagem</div>
                )}
              </div>
              <div className="card-content">
                <h3>{item.can.name}</h3>
                <p className="flavor">{item.can.flavor || 'Sabor não especificado'}</p>
                <p className="country">🌍 {item.can.country || 'País não especificado'}</p>
                <p className="size">📦 {item.can.size || 'Tamanho não especificado'}</p>
              </div>

              <div className="card-actions">
                <div className="quantity-controls">
                  <button
                    onClick={() => handleDecreaseQuantity(item.canId, item.quantity)}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    onClick={() => handleIncreaseQuantity(item.canId, item.quantity)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={() => navigate(`/can/${item.canId}`)}
                    className="view-btn"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => handleRemove(item.canId)}
                    className="remove-btn"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
