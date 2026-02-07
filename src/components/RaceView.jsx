import React from 'react'
import { SkaterCard } from './SkaterCard'
import { RaceChart } from './RaceChart'
import { RecordTimesPanel } from './RecordTimesPanel'
import { Countdown } from './Countdown'

export function RaceView({
  raceData,
  standings,
  distanceRecords,
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

  // Event not started yet
  if (raceData?.status === 'not_started') {
    const event = raceData.event
    return (
      <div className="race-view">
        <div className="event-status not-started">
          <div className="status-icon">📅</div>
          <h2>{distance}m</h2>
          <p className="status-message">{raceData.message}</p>
          {event && (
            <>
              <div className="event-details">
                <p>{event.location}</p>
              </div>
              <div className="start-time">
                <span>Starttijd:</span>
                <span className="start-time-value">{event.startTime}</span>
                <span>({event.timezone?.split('/')[1] || 'lokale tijd'})</span>
              </div>
              {event.startDateTime && (
                <Countdown targetDate={event.startDateTime} />
              )}
            </>
          )}
        </div>

        {/* Still show records for reference */}
        {distanceRecords && (
          <RecordTimesPanel
            distance={distance}
            standings={[]}
            skaters={[]}
            distanceRecords={distanceRecords}
            isOlympicEvent={distanceRecords?.isOlympicEvent}
          />
        )}
      </div>
    )
  }

  // Event ended
  if (raceData?.status === 'ended') {
    return (
      <div className="race-view">
        <div className="event-status ended">
          <div className="status-icon">🏁</div>
          <h2>{distance}m</h2>
          <p className="status-message">{raceData.message}</p>
        </div>
      </div>
    )
  }

  // Waiting for next race
  if (!raceData || raceData.status === 'waiting') {
    return (
      <div className="race-view">
        <div className="event-status waiting">
          <div className="status-icon">⏳</div>
          <h2>{distance}m</h2>
          <p className="status-message">{raceData?.message || 'Wachten op volgende rit...'}</p>
          {raceData?.isuUrl && (
            <a 
              href={raceData.isuUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="isu-link"
            >
              Bekijk lap times op ISU Live
            </a>
          )}
        </div>

        {/* Show records while waiting */}
        {distanceRecords && (
          <RecordTimesPanel
            distance={distance}
            standings={standings?.standings || []}
            skaters={[]}
            distanceRecords={distanceRecords}
            isOlympicEvent={distanceRecords?.isOlympicEvent}
          />
        )}

        {standings && standings.standings && standings.standings.length > 0 && (
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

      {/* Reference times panel */}
      <RecordTimesPanel
        distance={distance}
        standings={standings?.standings}
        skaters={currentRace.skaters}
        distanceRecords={distanceRecords}
        isOlympicEvent={distanceRecords?.isOlympicEvent}
      />

      <div className="skaters-grid">
        {currentRace.skaters?.map((skater, index) => (
          <SkaterCard
            key={skater.id || index}
            skater={skater}
            distance={distance}
            reference={reference}
            standings={standings?.standings}
            distanceConfig={raceData.distanceConfig}
            leader={currentRace.leader}
          />
        ))}
      </div>

      {distance >= 1500 && currentRace.skaters && (
        <RaceChart
          skaters={currentRace.skaters}
          standings={standings?.standings}
          distance={distance}
          reference={reference}
          top3={currentRace.top3}
          leader={currentRace.leader}
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
