import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/firebase/auth';
import { canService, type CanFilter } from '../services/cans/canService';
import { catalogMetadataService } from '../services/cans/catalogMetadataService';
import type { MonsterCan } from '../types';
import './Catalog.css';

export default function Catalog() {
  const [cans, setCans] = useState<MonsterCan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCans, setFilteredCans] = useState<MonsterCan[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Opções de filtro
  const [countries, setCountries] = useState<string[]>([]);
  const [flavors, setFlavors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Filtros selecionados
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showActive, setShowActive] = useState(true);
  const [showDiscontinued, setShowDiscontinued] = useState(false);

  // Metadados de sincronização
  const [syncInfo, setSyncInfo] = useState('');

  const navigate = useNavigate();

  // Carregar dados iniciais
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        // Carregar todas as latas
        const allCans = await canService.getAllCans();
        setCans(allCans);
        setFilteredCans(allCans);

        // Carregar opções de filtro
        const [countriesData, flavorsData, sizesData, yearsData, categoriesData] = await Promise.all([
          canService.getCountries(),
          canService.getFlavors(),
          canService.getSizes(),
          canService.getYears(),
          canService.getCategories(),
        ]);

        setCountries(countriesData);
        setFlavors(flavorsData);
        setSizes(sizesData);
        setYears(yearsData);
        setCategories(categoriesData);

        // Carregar informações de sincronização
        const info = await catalogMetadataService.getDisplayInfo();
        setSyncInfo(info);
      } catch (err) {
        console.error('Erro ao carregar catálogo:', err);
        setError('Erro ao carregar catálogo');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Aplicar filtros quando mudam
  useEffect(() => {
    const applyFilters = async () => {
      try {
        let results = cans;

        // Aplicar filtro de busca
        if (searchTerm.trim()) {
          const searchResults = await canService.searchCans(searchTerm);
          results = searchResults;
        }

        // Aplicar filtros
        const filter: CanFilter = {};

        if (selectedCountries.length > 0) {
          filter.countries = selectedCountries;
        }
        if (selectedFlavors.length > 0) {
          filter.flavors = selectedFlavors;
        }
        if (selectedSizes.length > 0) {
          filter.sizes = selectedSizes;
        }
        if (selectedYears.length > 0) {
          filter.years = selectedYears;
        }
        if (selectedCategories.length > 0) {
          filter.categories = selectedCategories;
        }

        // Aplicar filtro de status
        if (showActive && !showDiscontinued) {
          filter.discontinued = false;
        } else if (!showActive && showDiscontinued) {
          filter.discontinued = true;
        }
        // Se ambos estão selecionados, não filtra por discontinued

        // Se temos filtros, aplicá-los
        if (Object.keys(filter).length > 0) {
          const filtered = await canService.filterCans(filter);
          results = results.filter((can) => filtered.some((f) => f.id === can.id));
        }

        setFilteredCans(results);
      } catch (err) {
        console.error('Erro ao filtrar:', err);
      }
    };

    applyFilters();
  }, [
    searchTerm,
    selectedCountries,
    selectedFlavors,
    selectedSizes,
    selectedYears,
    selectedCategories,
    showActive,
    showDiscontinued,
    cans,
  ]);

  const toggleFilter = (
    value: string | number,
    selected: (string | number)[],
    setSelected: (value: (string | number)[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  // Wrappers específicos para cada tipo
  const toggleCountry = (value: string) => {
    toggleFilter(value, selectedCountries, setSelectedCountries as any);
  };

  const toggleFlavor = (value: string) => {
    toggleFilter(value, selectedFlavors, setSelectedFlavors as any);
  };

  const toggleSize = (value: string) => {
    toggleFilter(value, selectedSizes, setSelectedSizes as any);
  };

  const toggleYear = (value: number) => {
    toggleFilter(value, selectedYears, setSelectedYears as any);
  };

  const toggleCategory = (value: string) => {
    toggleFilter(value, selectedCategories, setSelectedCategories as any);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCountries([]);
    setSelectedFlavors([]);
    setSelectedSizes([]);
    setSelectedYears([]);
    setSelectedCategories([]);
    setShowActive(true);
    setShowDiscontinued(false);
  };

  const activeFilterCount =
    selectedCountries.length +
    selectedFlavors.length +
    selectedSizes.length +
    selectedYears.length +
    selectedCategories.length +
    (showDiscontinued ? 1 : 0) +
    (showActive ? 0 : 1);

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
        <p>Total: {cans.length} latas | Mostrando: {filteredCans.length}</p>
        {syncInfo && <p className="sync-info">📅 {syncInfo}</p>}
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Buscar por nome, sabor, marca ou país..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          🔍 Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {showFilters && (
        <div className="filters-section">
          <div className="filters-header">
            <h3>Filtros</h3>
            {activeFilterCount > 0 && (
              <button onClick={clearAllFilters} className="clear-filters-btn">
                Limpar ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <h4>Status</h4>
            <div className="filter-options">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={showActive}
                  onChange={(e) => setShowActive(e.target.checked)}
                />
                Ativas ({cans.filter((c) => !c.discontinued).length})
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={showDiscontinued}
                  onChange={(e) => setShowDiscontinued(e.target.checked)}
                />
                Descontinuadas ({cans.filter((c) => c.discontinued).length})
              </label>
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="filter-group">
              <h4>Categoria</h4>
              <div className="filter-options">
                {categories.map((cat) => (
                  <label key={cat} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Country Filter */}
          {countries.length > 0 && (
            <div className="filter-group">
              <h4>País</h4>
              <div className="filter-options">
                {countries.map((country) => (
                  <label key={country} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country)}
                      onChange={() => toggleCountry(country)}
                    />
                    {country}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Flavor Filter */}
          {flavors.length > 0 && (
            <div className="filter-group">
              <h4>Sabor</h4>
              <div className="filter-options">
                {flavors.map((flavor) => (
                  <label key={flavor} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedFlavors.includes(flavor)}
                      onChange={() => toggleFlavor(flavor)}
                    />
                    {flavor}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Size Filter */}
          {sizes.length > 0 && (
            <div className="filter-group">
              <h4>Tamanho</h4>
              <div className="filter-options">
                {sizes.map((size) => (
                  <label key={size} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Year Filter */}
          {years.length > 0 && (
            <div className="filter-group">
              <h4>Ano de Lançamento</h4>
              <div className="filter-options">
                {years.map((year) => (
                  <label key={year} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedYears.includes(year)}
                      onChange={() => toggleYear(year)}
                    />
                    {year}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {filteredCans.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma lata encontrada com os filtros selecionados.</p>
          <button onClick={clearAllFilters} className="clear-btn">
            Limpar filtros
          </button>
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
                {can.discontinued && <div className="discontinued-badge">Descontinuado</div>}
              </div>
              <div className="can-content">
                <h3>{can.name}</h3>
                <p className="flavor">{can.flavor || 'Sabor não especificado'}</p>
                <div className="can-details">
                  <span className="detail">🌍 {can.country || 'País não especificado'}</span>
                  <span className="detail">📦 {can.size || 'Tamanho não especificado'}</span>
                </div>
                {can.releaseYear && <p className="year">Lançamento: {can.releaseYear}</p>}
                {can.verified && <p className="verified">✓ Verificado</p>}
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
