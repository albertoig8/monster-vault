import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import './AdminPanel.css';

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const sampleCans = [
    {
      id: '5000112157646',
      brand: 'Monster Energy',
      name: 'Monster Energy Ultra Violet',
      flavor: 'Grape',
      description: 'Monster Energy Ultra Violet - Bebida energética com sabor uva',
      category: 'Regular',
      country: 'USA',
      size: '473ml',
      barcode: '5000112157646',
      imageUrl: 'https://images.unsplash.com/photo-1554866585-f5f1f9b2a17f?w=400&h=500&fit=crop',
      releaseYear: 2020,
      caffeine: 160,
      sugar: 54,
      discontinued: false,
      verified: true,
      sources: [{ provider: 'manual', lastCheckedAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5000112157647',
      brand: 'Monster Energy',
      name: 'Monster Energy Absolutely Zero',
      flavor: 'Original',
      description: 'Monster Energy Absolutely Zero - Zero açúcar, zero calorias',
      category: 'Zero Sugar',
      country: 'USA',
      size: '473ml',
      barcode: '5000112157647',
      imageUrl: 'https://images.unsplash.com/photo-1554867700-e2ea0a109b16?w=400&h=500&fit=crop',
      releaseYear: 2015,
      caffeine: 160,
      sugar: 0,
      discontinued: false,
      verified: true,
      sources: [{ provider: 'manual', lastCheckedAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5000112157648',
      brand: 'Monster Energy',
      name: 'Monster Energy Mango Loco',
      flavor: 'Mango',
      description: 'Monster Energy Mango Loco - Sabor tropical de manga',
      category: 'Flavor',
      country: 'Brazil',
      size: '473ml',
      barcode: '5000112157648',
      imageUrl: 'https://images.unsplash.com/photo-1567359781514-a92e14f6c6ab?w=400&h=500&fit=crop',
      releaseYear: 2018,
      caffeine: 160,
      sugar: 54,
      discontinued: false,
      verified: true,
      sources: [{ provider: 'manual', lastCheckedAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5000112157649',
      brand: 'Monster Energy',
      name: 'Monster Energy Rehab Tea + Lemonade',
      flavor: 'Tea + Lemonade',
      description: 'Monster Energy Rehab - Chá e limão',
      category: 'Rehab',
      country: 'UK',
      size: '500ml',
      barcode: '5000112157649',
      imageUrl: 'https://images.unsplash.com/photo-1599599810694-a5de1b3a6ba0?w=400&h=500&fit=crop',
      releaseYear: 2012,
      caffeine: 80,
      sugar: 27,
      discontinued: false,
      verified: true,
      sources: [{ provider: 'manual', lastCheckedAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5000112157650',
      brand: 'Monster Energy',
      name: 'Monster Energy Japan',
      flavor: 'Original',
      description: 'Monster Energy Japan Edition - Edição exclusiva japonesa',
      category: 'Regular',
      country: 'Japan',
      size: '250ml',
      barcode: '5000112157650',
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=500&fit=crop',
      releaseYear: 2015,
      caffeine: 80,
      sugar: 27,
      discontinued: false,
      edition: 'Japan Limited',
      verified: true,
      sources: [{ provider: 'manual', lastCheckedAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const handleSeedData = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('🌱 Iniciando seed de dados...');

      // Adicionar latas
      for (const can of sampleCans) {
        await setDoc(doc(db, 'cans', can.id), can);
        console.log(`✅ ${can.name}`);
      }

      // Adicionar metadados
      await setDoc(doc(db, 'catalogMetadata', 'sync'), {
        lastStartedAt: new Date().toISOString(),
        lastCompletedAt: new Date().toISOString(),
        lastSuccessfulAt: new Date().toISOString(),
        totalProcessed: sampleCans.length,
        totalCreated: sampleCans.length,
        totalUpdated: 0,
        totalSkipped: 0,
      });

      setSuccess(`✅ ${sampleCans.length} latas adicionadas com sucesso!`);
      console.log('✨ Seed concluído!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`❌ Erro: ${message}`);
      console.error('Erro ao fazer seed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <h2>🔧 Painel de Administração</h2>

        <div className="admin-section">
          <h3>Seed de Dados</h3>
          <p>Adicione 5 latas de exemplo ao catálogo para testes.</p>

          <button className="btn-seed" onClick={handleSeedData} disabled={loading}>
            {loading ? '⏳ Processando...' : '🌱 Fazer Seed de Dados'}
          </button>

          {success && <div className="message success">{success}</div>}
          {error && <div className="message error">{error}</div>}
        </div>

        <div className="admin-info">
          <p>
            💡 <strong>Dica:</strong> Após fazer seed, acesse a página{' '}
            <strong>Catálogo</strong> para ver os dados e testar a sincronização com Open Food
            Facts.
          </p>
        </div>
      </div>
    </div>
  );
}
