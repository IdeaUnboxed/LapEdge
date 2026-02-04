import React, { useState } from 'react'

export function SettingsPanel({ settings, onUpdate, onClose }) {
  const [refreshing, setRefreshing] = useState(false)
  const [refreshStatus, setRefreshStatus] = useState(null)

  const handleIntervalChange = (e) => {
    const value = parseInt(e.target.value, 10)
    onUpdate({ ...settings, updateInterval: value })
  }

  const handleRefreshRecords = async () => {
    setRefreshing(true)
    setRefreshStatus(null)
    
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'records' })
      })
      
      if (response.ok) {
        setRefreshStatus({ type: 'success', message: 'Records cache geleegd - PR/SB wordt opnieuw opgehaald' })
      } else {
        throw new Error('Refresh failed')
      }
    } catch (error) {
      setRefreshStatus({ type: 'error', message: 'Fout bij verversen: ' + error.message })
    } finally {
      setRefreshing(false)
    }
  }

  const handleRefreshAll = async () => {
    setRefreshing(true)
    setRefreshStatus(null)
    
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      
      if (response.ok) {
        setRefreshStatus({ type: 'success', message: 'Alle caches geleegd' })
      } else {
        throw new Error('Refresh failed')
      }
    } catch (error) {
      setRefreshStatus({ type: 'error', message: 'Fout bij verversen: ' + error.message })
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Instellingen</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="setting-group">
            <label className="setting-label">Update interval</label>
            <p className="setting-description">
              Hoe vaak de live data wordt ververst (in seconden)
            </p>
            <div className="setting-range">
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={settings.updateInterval / 1000}
                onChange={(e) => onUpdate({
                  ...settings,
                  updateInterval: parseInt(e.target.value, 10) * 1000
                })}
              />
              <span className="value">{settings.updateInterval / 1000}s</span>
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">Categorie</label>
            <p className="setting-description">
              Heren of dames (voor records)
            </p>
            <select
              className="setting-input"
              value={settings.gender}
              onChange={(e) => onUpdate({
                ...settings,
                gender: e.target.value
              })}
            >
              <option value="men">Heren</option>
              <option value="women">Dames</option>
            </select>
          </div>

          <div className="setting-group">
            <label className="setting-label">Standaard referentie</label>
            <p className="setting-description">
              Welke referentie standaard wordt getoond
            </p>
            <select
              className="setting-input"
              value={settings.defaultReference}
              onChange={(e) => onUpdate({
                ...settings,
                defaultReference: e.target.value
              })}
            >
              <option value="leader">Leider</option>
              <option value="pr">Persoonlijk Record</option>
              <option value="seasonBest">Seizoensbeste</option>
              <option value="even">Vlak schema</option>
            </select>
          </div>

          <div className="setting-group">
            <label className="setting-label">Compact weergave</label>
            <p className="setting-description">
              Toon minder details voor kleinere schermen
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => onUpdate({
                  ...settings,
                  compactMode: e.target.checked
                })}
              />
              Compact mode inschakelen
            </label>
          </div>

          <div className="setting-group">
            <label className="setting-label">Toon grafieken</label>
            <p className="setting-description">
              Toon grafiek met verloop ten opzichte van referentie
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={settings.showCharts}
                onChange={(e) => onUpdate({
                  ...settings,
                  showCharts: e.target.checked
                })}
              />
              Grafieken weergeven
            </label>
          </div>

          <div className="setting-group">
            <label className="setting-label">Data verversen</label>
            <p className="setting-description">
              Leeg de cache om PR/SB opnieuw op te halen van speedskatingresults.com
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button 
                className="btn btn-secondary"
                onClick={handleRefreshRecords}
                disabled={refreshing}
              >
                {refreshing ? 'Bezig...' : 'PR/SB verversen'}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={handleRefreshAll}
                disabled={refreshing}
              >
                Alles verversen
              </button>
            </div>
            {refreshStatus && (
              <div 
                className={`refresh-status ${refreshStatus.type}`}
                style={{ 
                  marginTop: '8px', 
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  background: refreshStatus.type === 'success' 
                    ? 'rgba(34, 197, 94, 0.15)' 
                    : 'rgba(239, 68, 68, 0.15)',
                  color: refreshStatus.type === 'success' 
                    ? '#22c55e' 
                    : '#ef4444'
                }}
              >
                {refreshStatus.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
