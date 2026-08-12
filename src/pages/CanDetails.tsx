import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/firebase/auth';
import { canService } from '../services/cans/canService';
import { collectionService } from '../services/collection/collectionService';
import { wishlistService } from '../services/collection/wishlistService';
import type { MonsterCan } from '../types';
import './CanDetails.css';

export default function CanDetails() {
  const { canId } = useParams<{ canId: string }>();
  const [can, setCan] = useState<MonsterCan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCollection, setInCollection] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || !canId) {
      navigate('/login');
      return;
    }

    const loadCanDetails = async () => {
      try {
        setLoading(true);
        const canData = await canService.getCanById(canId);
        if (!canData) {
          setError('Lata não encontrada');
          return;
        }
        setCan(canData);

        const qty = await collectionService.getQuantity(user.uid, canId);
        setQuantity(qty);
        setInCollection(qty > 0);

        const inWish = await wishlistService.isInWishlist(user.uid, canId);
        setInWishlist(inWish);
      } catch (err) {
        console.error('Erro ao carregar detalhes:', err);
        setError('Erro ao carregar detalhes da lata');
      } finally {
        setLoading(false);
      }
    };

    loadCanDetails();
  }, [canId, navigate]);

  const handleAddToCollection = async () => {
    const user = authService.getCurrentUser();
    if (!user || !canId) return;

    try {
      await collectionService.addToCollection(user.uid, canId, 1);
      setQuantity(quantity + 1);
      setInCollection(true);
    } catch (err) {
      console.error('Erro ao adicionar à coleção:', err);
      setError('Erro ao adicionar à coleção');
    }
  };

  const handleRemoveFromCollection = async () => {
    const user = authService.getCurrentUser();
    if (!user || !canId) return;

    try {
      await collectionService.removeFromCollection(user.uid, canId);
      setQuantity(0);
      setInCollection(false);
    } catch (err) {
      console.error('Erro ao remover da coleção:', err);
      setError('Erro ao remover da coleção');
    }
  };

  const handleAddToWishlist = async () => {
    const user = authService.getCurrentUser();
    if (!user || !canId) return;

    try {
      await wishlistService.addToWishlist(user.uid, canId);
      setInWishlist(true);
    } catch (err) {
      console.error('Erro ao adicionar à wishlist:', err);
      setError('Erro ao adicionar à wishlist');
    }
  };

  const handleRemoveFromWishlist = async () => {
    const user = authService.getCurrentUser();
    if (!user || !canId) return;

    try {
      await wishlistService.removeFromWishlist(user.uid, canId);
      setInWishlist(false);
    } catch (err) {
      console.error('Erro ao remover da wishlist:', err);
      setError('Erro ao remover da wishlist');
    }
  };

  const handleIncreaseQuantity = async () => {
    const user = authService.getCurrentUser();
    if (!user || !canId) return;

    try {
      await collectionService.incrementQuantity(user.uid, canId, 1);
      setQuantity(quantity + 1);
    } catch (err) {
      console.error('Erro ao incrementar quantidade:', err);
      setError('Erro ao incrementar quantidade');
    }
  };

  const handleDecreaseQuantity = async () => {
    const user = authService.getCurrentUser();
    if (!user || !canId) return;

    if (quantity <= 1) {
      await handleRemoveFromCollection();
      return;
    }

    try {
      await collectionService.incrementQuantity(user.uid, canId, -1);
      setQuantity(quantity - 1);
    } catch (err) {
      console.error('Erro ao decrementar quantidade:', err);
      setError('Erro ao decrementar quantidade');
    }
  };

  if (!authService.getCurrentUser()) {
    return null;
  }

  if (loading) {
    return (
      <div className="can-details">
        <p className="loading">Carregando...</p>
      </div>
    );
  }

  if (error || !can) {
    return (
      <div className="can-details">
        <button onClick={() => navigate('/catalog')} className="back-btn">
          ← Voltar ao Catálogo
        </button>
        <p className="error">{error || 'Lata não encontrada'}</p>
      </div>
    );
  }

  return (
    <div className="can-details">
      <button onClick={() => navigate('/catalog')} className="back-btn">
        ← Voltar ao Catálogo
      </button>

      <div className="details-container">
        <div className="image-section">
          {can.imageUrl ? (
            <img src={can.imageUrl} alt={can.name} className="large-image" />
          ) : (
            <div className="no-image-large">Sem imagem disponível</div>
          )}
        </div>

        <div className="info-section">
          <h1>{can.name}</h1>
          <p className="flavor">{can.flavor || 'Sabor não especificado'}</p>

          {can.description && <p className="description">{can.description}</p>}

          <div className="details-grid">
            {can.country && (
              <div className="detail-item">
                <span className="label">País</span>
                <span className="value">🌍 {can.country}</span>
              </div>
            )}
            {can.size && (
              <div className="detail-item">
                <span className="label">Tamanho</span>
                <span className="value">📦 {can.size}</span>
              </div>
            )}
            {can.releaseYear && (
              <div className="detail-item">
                <span className="label">Ano de Lançamento</span>
                <span className="value">{can.releaseYear}</span>
              </div>
            )}
            {can.caffeine && (
              <div className="detail-item">
                <span className="label">Cafeína</span>
                <span className="value">{can.caffeine}mg</span>
              </div>
            )}
            {can.sugar && (
              <div className="detail-item">
                <span className="label">Açúcar</span>
                <span className="value">{can.sugar}g</span>
              </div>
            )}
            {can.barcode && (
              <div className="detail-item">
                <span className="label">Código de Barras</span>
                <span className="value">{can.barcode}</span>
              </div>
            )}
          </div>

          {can.discontinued && <p className="discontinued-badge">Descontinuado</p>}

          <div className="actions-section">
            {inCollection ? (
              <div className="quantity-control">
                <label>Quantidade na Coleção:</label>
                <div className="quantity-buttons">
                  <button onClick={handleDecreaseQuantity} className="qty-btn">
                    −
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button onClick={handleIncreaseQuantity} className="qty-btn">
                    +
                  </button>
                </div>
                <button onClick={handleRemoveFromCollection} className="remove-btn">
                  Remover da Coleção
                </button>
              </div>
            ) : (
              <button onClick={handleAddToCollection} className="add-btn">
                + Adicionar à Coleção
              </button>
            )}

            {inWishlist ? (
              <button onClick={handleRemoveFromWishlist} className="remove-wishlist-btn">
                ❤ Remover da Wishlist
              </button>
            ) : (
              <button onClick={handleAddToWishlist} className="add-wishlist-btn">
                🤍 Adicionar à Wishlist
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
