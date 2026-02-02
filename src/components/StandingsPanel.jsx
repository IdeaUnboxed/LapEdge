import React from 'react'
import { formatTime } from '../utils/timeFormat'

export function StandingsPanel({ standings, distance }) {
  if (!standings || !standings.standings || standings.standings.length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Klassement</span>
        </div>
        <div className="loading">
          <span>Nog geen resultaten</span>
        </div>
      </div>
    )
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Klassement {distance}m</span>
      </div>

      <div className="standings-list">
        {standings.standings.slice(0, 10).map((entry, index) => (
          <div key={index} className="standing-row">
            <span className="standing-rank">{entry.rank}</span>
            <div className="standing-skater">
              <span className="standing-name">{entry.name}</span>
              <span className="standing-country">{entry.country}</span>
            </div>
            <div className="standing-time">
              <div>{formatTime(entry.time)}</div>
              {entry.difference && (
                <div className="standing-diff">+{entry.difference.toFixed(2)}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
