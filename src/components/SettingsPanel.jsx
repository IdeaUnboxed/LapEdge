import React from 'react'

export function SettingsPanel({ settings, onUpdate, onClose }) {
  const handleIntervalChange = (e) => {
    const value = parseInt(e.target.value, 10)
    onUpdate({ ...settings, updateInterval: value })
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
        </div>
      </div>
    </div>
  )
}
