import React from 'react'
import { SkaterCard } from './SkaterCard'
import { RaceChart } from './RaceChart'

export function RaceView({
  raceData,
  standings,
  distance,
  reference,
  onReferenceChange,
  loading,
  error
}) {
  if (loading && !raceData) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Live data laden...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error">
        <p>Fout bij laden: {error}</p>
        <p>Controleer je verbinding en probeer opnieuw</p>
      </div>
    )
  }

  if (!raceData || raceData.status === 'waiting') {
    return (
      <div className="race-view">
        <div className="race-header">
          <div className="race-info">
            <h2>{distance}m</h2>
            <p className="race-pair">Wachten op volgende rit...</p>
          </div>
        </div>

        {standings && standings.standings && (
          <RaceChart
            standings={standings.standings}
            distance={distance}
          />
        )}
      </div>
    )
  }

  const { currentRace } = raceData

  return (
    <div className="race-view">
      <div className="race-header">
        <div className="race-info">
          <h2>{distance}m</h2>
          <p className="race-pair">
            Rit {currentRace.pairNumber} - {getStatusText(currentRace.status)}
          </p>
        </div>

        <div className="reference-selector">
          <button
            className={`reference-btn ${reference === 'leader' ? 'active' : ''}`}
            onClick={() => onReferenceChange('leader')}
          >
            vs Leider
          </button>
          <button
            className={`reference-btn ${reference === 'pr' ? 'active' : ''}`}
            onClick={() => onReferenceChange('pr')}
          >
            vs PR
          </button>
          <button
            className={`reference-btn ${reference === 'seasonBest' ? 'active' : ''}`}
            onClick={() => onReferenceChange('seasonBest')}
          >
            vs SB
          </button>
          <button
            className={`reference-btn ${reference === 'even' ? 'active' : ''}`}
            onClick={() => onReferenceChange('even')}
          >
            Vlak schema
          </button>
        </div>
      </div>

      <div className="skaters-grid">
        {currentRace.skaters?.map((skater, index) => (
          <SkaterCard
            key={skater.id || index}
            skater={skater}
            distance={distance}
            reference={reference}
            standings={standings?.standings}
            distanceConfig={raceData.distanceConfig}
          />
        ))}
      </div>

      {distance >= 1500 && currentRace.skaters && (
        <RaceChart
          skaters={currentRace.skaters}
          standings={standings?.standings}
          distance={distance}
          reference={reference}
        />
      )}
    </div>
  )
}

function getStatusText(status) {
  const statusMap = {
    in_progress: 'Bezig',
    finished: 'Afgerond',
    waiting: 'Wachtend',
    started: 'Gestart'
  }
  return statusMap[status] || status
}
