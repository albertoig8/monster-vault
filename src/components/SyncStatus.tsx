import { useState } from 'react';
import { catalogMetadataService } from '../services/cans/catalogMetadataService';
import type { CatalogMetadata } from '../types';
import './SyncStatus.css';

interface SyncStatusProps {
  onSyncComplete?: () => void;
}

export default function SyncStatus({ onSyncComplete }: SyncStatusProps) {
  const [metadata, setMetadata] = useState<CatalogMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  // Carregar metadados
  const loadMetadata = async () => {
    try {
      setLoading(true);
      const data = await catalogMetadataService.getMetadata();
      setMetadata(data);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar metadados:', err);
      setError('Erro ao carregar status de sincronização');
    } finally {
      setLoading(false);
    }
  };

  // Sincronizar catálogo
  const handleSync = async () => {
    try {
      setSyncing(true);
      setError('');

      // Chamar Cloud Function
      const response = await fetch(
        `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/syncCatalog`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na sincronização: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Recarregar metadados
        await loadMetadata();
        onSyncComplete?.();
      } else {
        setError(data.message || 'Erro ao sincronizar');
      }
    } catch (err) {
      console.error('Erro ao sincronizar:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setSyncing(false);
    }
  };

  // Formatar data
  const formatDate = (date: any): string => {
    if (!date) return 'Nunca';

    if (typeof date === 'object' && 'toDate' in date) {
      const jsDate = date.toDate?.() || new Date(date);
      return jsDate.toLocaleDateString('pt-BR') + ' ' + jsDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    if (date instanceof Date) {
      return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    return 'Desconhecido';
  };

  // Carregar na montagem
  if (!metadata && !loading && expanded) {
    loadMetadata();
  }

  const hasSync = metadata?.lastSuccessfulAt;
  const statusClass = hasSync ? 'success' : 'never';

  return (
    <div className="sync-status">
      {/* Header */}
      <button className={`sync-header ${statusClass}`} onClick={() => setExpanded(!expanded)}>
        <div className="sync-header-content">
          <span className="sync-icon">
            {syncing ? '⏳' : hasSync ? '✅' : '⚠️'}
          </span>
          <div className="sync-header-text">
            <h3>Status de Sincronização</h3>
            <p className="sync-status-text">
              {syncing
                ? 'Sincronizando...'
                : hasSync
                  ? `Última atualização: ${formatDate(metadata.lastSuccessfulAt)}`
                  : 'Sincronização nunca executada'}
            </p>
          </div>
          <span className="expand-icon">{expanded ? '▼' : '▶'}</span>
        </div>
      </button>

      {/* Conteúdo expandido */}
      {expanded && (
        <div className="sync-content">
          {/* Botão de Sincronização */}
          <button
            className="btn-sync"
            onClick={handleSync}
            disabled={syncing || loading}
          >
            {syncing ? (
              <>
                <span className="spinner"></span>
                Sincronizando...
              </>
            ) : (
              <>
                <span>🔄</span>
                Sincronizar Agora
              </>
            )}
          </button>

          {/* Erro */}
          {error && <div className="sync-error">❌ {error}</div>}

          {/* Estatísticas */}
          {metadata && (
            <div className="sync-stats">
              <div className="stat-group">
                <h4>Última Sincronização</h4>
                <div className="stat-row">
                  <span>Início:</span>
                  <strong>{formatDate(metadata.lastStartedAt)}</strong>
                </div>
                <div className="stat-row">
                  <span>Conclusão:</span>
                  <strong>{formatDate(metadata.lastCompletedAt)}</strong>
                </div>
                <div className="stat-row">
                  <span>Sucesso:</span>
                  <strong>{formatDate(metadata.lastSuccessfulAt)}</strong>
                </div>
              </div>

              <div className="stat-group">
                <h4>Estatísticas</h4>
                <div className="stat-row">
                  <span>📥 Total Processado:</span>
                  <strong>{metadata.totalProcessed || 0}</strong>
                </div>
                <div className="stat-row">
                  <span>✨ Produtos Criados:</span>
                  <strong>{metadata.totalCreated || 0}</strong>
                </div>
                <div className="stat-row">
                  <span>⚡ Produtos Atualizados:</span>
                  <strong>{metadata.totalUpdated || 0}</strong>
                </div>
                <div className="stat-row">
                  <span>⏭️ Pulados:</span>
                  <strong>{metadata.totalSkipped || 0}</strong>
                </div>
              </div>

              {metadata.lastError && (
                <div className="stat-group error">
                  <h4>⚠️ Último Erro</h4>
                  <p>{metadata.lastError}</p>
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && !metadata && (
            <div className="sync-loading">
              <span className="spinner"></span>
              Carregando dados...
            </div>
          )}

          {/* Info */}
          <div className="sync-info-box">
            <p>
              💡 A sincronização busca novos produtos no Open Food Facts e atualiza o catálogo automaticamente.
            </p>
            <p>
              ⏰ Sincronização automática: Diariamente às 03:00 UTC
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
