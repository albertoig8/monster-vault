import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/firebase/auth';
import { canService } from '../services/cans/canService';
import type { MonsterCan } from '../types';
import './Catalog.css';

export default function Catalog() {
  const [cans, setCans] = useState<MonsterCan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCans, setFilteredCans] = useState<MonsterCan[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const loadCans = async () => {
      try {
        setLoading(true);
        const allCans = await canService.getAllCans();
        setCans(allCans);
        setFilteredCans(allCans);
      } catch (err) {
        console.error('Erro ao carregar catálogo:', err);
        setError('Erro ao carregar catálogo');
      } finally {
        setLoading(false);
      }
    };

    loadCans();
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCans(cans);
    } else {
      const results = cans.filter((can) => {
        const name = can.name?.toLowerCase() || '';
        const flavor = can.flavor?.toLowerCase() || '';
        const country = can.country?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return name.includes(search) || flavor.includes(search) || country.includes(search);
      });
      setFilteredCans(results);
    }
  }, [searchTerm, cans]);

  if (!authService.getCurrentUser()) {
    return null;
  }

  if (loading) {
    return (
      <div className="catalog">
        <p className="loading">Carregando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="catalog">
      <div className="catalog-header">
        <h1>Catálogo de Latas</h1>
        <p>{filteredCans.length} latas encontradas</p>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Buscar por nome, sabor ou país..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredCans.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma lata encontrada.</p>
          {searchTerm && <button onClick={() => setSearchTerm('')} className="clear-btn">Limpar busca</button>}
        </div>
      ) : (
        <div className="cans-grid">
          {filteredCans.map((can) => (
            <div key={can.id} className="can-card">
              <div className="can-image-container">
                {can.imageUrl ? (
                  <img src={can.imageUrl} alt={can.name} />
                ) : (
                  <div className="no-image">Sem imagem</div>
                )}
              </div>
              <div className="can-content">
                <h3>{can.name}</h3>
                <p className="flavor">{can.flavor || 'Sabor não especificado'}</p>
                <div className="can-details">
                  <span className="detail">🌍 {can.country || 'País não especificado'}</span>
                  <span className="detail">📦 {can.size || 'Tamanho não especificado'}</span>
                </div>
                {can.releaseYear && <p className="year">Lançamento: {can.releaseYear}</p>}
                {can.discontinued && <p className="discontinued">Descontinuado</p>}
              </div>
              <button onClick={() => navigate(`/can/${can.id}`)} className="view-btn">
                Ver Detalhes
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
