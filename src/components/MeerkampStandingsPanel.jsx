import React, { useState, useEffect } from 'react'
import { formatPoints, formatPointsGap, timeNeededToLead } from '../utils/samalog'
import { formatTime } from '../utils/timeFormat'

// Helper to format time difference in milliseconds
function formatTimeDiff(timeMs) {
  if (timeMs === null || timeMs === undefined) return '–'
  const timeSec = timeMs / 1000
  const prefix = timeSec >= 0 ? '+' : ''
  return `${prefix}${timeSec.toFixed(2)}s`
}

export function MeerkampStandingsPanel({ eventId, gender, updateInterval = 5000 }) {
  const [standings, setStandings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [referenceMode, setReferenceMode] = useState('leader') // 'leader' | 'specific'
  const [selectedSkater, setSelectedSkater] = useState(null)

  useEffect(() => {
    if (!eventId || !gender) return

    let isMounted = true
    let intervalId = null

    const fetchStandings = async () => {
      try {
        const response = await fetch(
          `/api/meerkamp/${eventId}/standings?gender=${gender}`
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()

        if (isMounted) {
          setStandings(data)
          setError(null)
          setLoading(false)
        }
      } catch (err) {
        console.error('Error fetching meerkamp standings:', err)
        if (isMounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    // Initial fetch
    fetchStandings()

    // Set up polling
    intervalId = setInterval(fetchStandings, updateInterval)

    return () => {
      isMounted = false
      if (intervalId) clearInterval(intervalId)
    }
  }, [eventId, gender, updateInterval])

  if (loading && !standings) {
    return (
      <div className="meerkamp-panel">
        <div className="loading">Laden...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="meerkamp-panel">
        <div className="error">
          <p>Fout bij laden meerkamp klassement</p>
          <p className="error-detail">{error}</p>
        </div>
      </div>
    )
  }

  if (!standings || !standings.standings || standings.standings.length === 0) {
    return (
      <div className="meerkamp-panel">
        <div className="placeholder">Geen meerkamp data beschikbaar</div>
      </div>
    )
  }

  const leader = standings.standings[0]
  const referenceSkater = referenceMode === 'leader'
    ? leader
    : standings.standings.find(s => s.skaterId === selectedSkater) || leader

  return (
    <div className="meerkamp-panel">
      <div className="meerkamp-header">
        <h3>Meerkamp Klassement</h3>
        <div className="meerkamp-info">
          <span className="event-type">{standings.eventType}</span>
          {standings.currentDistance && (
            <span className="current-distance">
              Nu: {standings.currentDistance}m ({standings.currentRaceStatus})
            </span>
          )}
        </div>
      </div>

      {/* Reference mode selector */}
      <div className="reference-selector">
        <label>
          Vergelijk met:
          <select
            value={referenceMode}
            onChange={(e) => setReferenceMode(e.target.value)}
          >
            <option value="leader">Virtuele #1</option>
            <option value="specific">Specifieke rijder</option>
          </select>
        </label>
        {referenceMode === 'specific' && (
          <select
            value={selectedSkater || ''}
            onChange={(e) => setSelectedSkater(e.target.value)}
          >
            <option value="">Kies rijder...</option>
            {standings.standings.filter(s => !s.dnf).map(s => (
              <option key={s.skaterId} value={s.skaterId}>
                {s.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Standings table */}
      <div className="standings-table">
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Naam</th>
              <th>Land</th>
              <th>Punten</th>
              <th>Virtueel</th>
              <th>Verschil</th>
              {standings.currentDistance && <th>Tijdsdoel</th>}
            </tr>
          </thead>
          <tbody>
            {standings.standings.map((skater) => {
              const isLeader = skater.rank === 1
              const isDNF = skater.dnf
              const timeGoal = standings.currentDistance && !isDNF
                ? timeNeededToLead(
                    skater.pointsVirtual - referenceSkater.pointsVirtual,
                    standings.currentDistance
                  )
                : null

              return (
                <tr
                  key={skater.skaterId}
                  className={`
                    ${isLeader ? 'leader' : ''}
                    ${isDNF ? 'dnf' : ''}
                  `}
                >
                  <td className="rank">{skater.rank}</td>
                  <td className="name">{skater.name}</td>
                  <td className="country">{skater.country}</td>
                  <td className="points">{formatPoints(skater.pointsFinished)}</td>
                  <td className="points-virtual">
                    {!isDNF ? formatPoints(skater.pointsVirtual) : '–'}
                  </td>
                  <td className="gap">
                    {!isDNF ? formatPointsGap(skater.gapToFirst) : 'DNF'}
                  </td>
                  {standings.currentDistance && (
                    <td className="time-goal">
                      {timeGoal !== null && timeGoal !== 0 ? (
                        <span className={getTimeGoalClass(timeGoal)}>
                          {formatTimeDiff(timeGoal)}
                        </span>
                      ) : (
                        '–'
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Remaining distances */}
      {standings.currentDistance && (
        <div className="remaining-distances">
          <h4>Resterende afstanden:</h4>
          <div className="distances-list">
            {standings.standings[0]?.remainingDistances?.map(d => (
              <span key={d} className="distance-badge">{d}m</span>
            ))}
          </div>
        </div>
      )}

      {/* Completed distances */}
      <div className="completed-distances">
        <h4>Gereden afstanden:</h4>
        <div className="distances-list">
          {standings.completedDistances.map(d => (
            <span key={d} className="distance-badge completed">{d}m</span>
          ))}
        </div>
      </div>

      <div className="last-updated">
        Laatst bijgewerkt: {new Date(standings.lastUpdated).toLocaleTimeString('nl-NL')}
      </div>
    </div>
  )
}

function getTimeGoalClass(timeMs) {
  if (!timeMs) return ''
  if (timeMs < -2000) return 'goal-easy'
  if (timeMs < 0) return 'goal-doable'
  if (timeMs < 1000) return 'goal-tight'
  return 'goal-difficult'
}
