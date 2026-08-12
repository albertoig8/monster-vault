import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/firebase/auth';
import { wishlistService } from '../services/collection/wishlistService';
import { collectionService } from '../services/collection/collectionService';
import type { MonsterCan } from '../types';
import './Wishlist.css';

interface WishlistItemWithCan {
  canId: string;
  addedAt: any;
  can: MonsterCan;
}

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItemWithCan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const loadWishlist = async () => {
      try {
        setLoading(true);
        const wishlistItems = await wishlistService.getUserWishlist(user.uid);
        setItems(wishlistItems);
      } catch (err) {
        console.error('Erro ao carregar wishlist:', err);
        setError('Erro ao carregar wishlist');
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [navigate]);

  const handleAddToCollection = async (canId: string) => {
    const user = authService.getCurrentUser();
    if (!user) return;

    try {
      await collectionService.addToCollection(user.uid, canId, 1);
      await wishlistService.removeFromWishlist(user.uid, canId);
      setItems(items.filter((item) => item.canId !== canId));
    } catch (err) {
      console.error('Erro ao adicionar à coleção:', err);
      setError('Erro ao adicionar à coleção');
    }
  };

  const handleRemoveFromWishlist = async (canId: string) => {
    const user = authService.getCurrentUser();
    if (!user) return;

    try {
      await wishlistService.removeFromWishlist(user.uid, canId);
      setItems(items.filter((item) => item.canId !== canId));
    } catch (err) {
      console.error('Erro ao remover da wishlist:', err);
      setError('Erro ao remover da wishlist');
    }
  };

  if (!authService.getCurrentUser()) {
    return null;
  }

  if (loading) {
    return (
      <div className="wishlist">
        <p className="loading">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="wishlist">
      <div className="wishlist-header">
        <h1>Minha Wishlist</h1>
        <p>{items.length} latas na sua lista de desejos</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Sua wishlist está vazia.</p>
          <button onClick={() => navigate('/catalog')} className="cta-button">
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => (
            <div key={item.canId} className="wishlist-card">
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

                {item.can.discontinued && <p className="discontinued">Descontinuado</p>}
              </div>

              <div className="card-actions">
                <button
                  onClick={() => handleAddToCollection(item.canId)}
                  className="add-to-collection-btn"
                >
                  ✓ Adicionar à Coleção
                </button>

                <button
                  onClick={() => navigate(`/can/${item.canId}`)}
                  className="view-btn"
                >
                  Ver Detalhes
                </button>

                <button
                  onClick={() => handleRemoveFromWishlist(item.canId)}
                  className="remove-btn"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
