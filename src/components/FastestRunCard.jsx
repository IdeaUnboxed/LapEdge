import React from 'react'
import { formatTime } from '../utils/timeFormat'

/**
 * Shows tussentijden (split times) of the fastest run so far (standings leader).
 * Rendered as 3rd column next to the two current skater cards.
 */
export function FastestRunCard({ leader }) {
  if (!leader?.passageTimes?.length) return null

  const passageTimes = leader.passageTimes
  const laps = passageTimes.map((cumulative, index) => {
    const prev = index > 0 ? passageTimes[index - 1] : 0
    return {
      lap: index + 1,
      time: cumulative - prev,
      cumulative
    }
  })

  return (
    <div className="skater-card fastest-run-card">
      <div className="skater-header">
        <div>
          <span className="skater-name">Snelste rit</span>
          <span className="skater-country">{leader.name} ({leader.country})</span>
        </div>
        <span className="fastest-run-total">{formatTime(leader.time)}</span>
      </div>

      <div className="skater-body">
        <table className="lap-table">
          <thead>
            <tr>
              <th>Ronde</th>
              <th>Tijd</th>
              <th>Cum.</th>
            </tr>
          </thead>
          <tbody>
            {laps.map((lap, index) => (
              <tr key={index}>
                <td className="lap-number">{lap.lap}</td>
                <td className="time-value">{formatTime(lap.time)}</td>
                <td className="time-value">{formatTime(lap.cumulative)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
