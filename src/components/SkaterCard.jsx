import React from 'react'
import { formatTime, formatDiff } from '../utils/timeFormat'
import { calculateVirtualRank, predictFinishTime } from '../utils/calculations'

export function SkaterCard({ skater, distance, reference, standings, distanceConfig }) {
  const virtualRank = calculateVirtualRank(skater, standings)
  const prediction = distance >= 1500 ? predictFinishTime(skater, distance, distanceConfig) : null

  return (
    <div className="skater-card">
      <div className="skater-header">
        <div>
          <span className="skater-name">{skater.name}</span>
          <span className="skater-country">{skater.country}</span>
        </div>
        <span className={`skater-lane ${skater.lane}`}>
          {skater.lane === 'inner' ? 'Binnenbaan' : 'Buitenbaan'}
        </span>
      </div>

      <div className="skater-body">
        <table className="lap-table">
          <thead>
            <tr>
              <th>Ronde</th>
              <th>Tijd</th>
              <th>Cum.</th>
              <th>{getReferenceLabel(reference)}</th>
              <th>Plek</th>
            </tr>
          </thead>
          <tbody>
            {skater.laps?.map((lap, index) => {
              const diff = calculateDiff(lap, skater, reference, standings, index)
              return (
                <tr key={index}>
                  <td className="lap-number">{lap.lap}</td>
                  <td className="time-value">{formatTime(lap.time)}</td>
                  <td className="time-value">{formatTime(lap.cumulative)}</td>
                  <td className={getDiffClass(diff)}>
                    {formatDiff(diff)}
                  </td>
                  <td className="time-value">{virtualRank || '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {prediction && (
          <div className="prediction">
            <div>
              <div className="prediction-label">Voorspelde eindtijd</div>
              <div>
                <span className="prediction-time">{formatTime(prediction.time)}</span>
                <span className="prediction-band">
                  ± {prediction.margin.toFixed(2)}s
                </span>
              </div>
            </div>
            <div className="virtual-rank">
              <span className="rank-badge">{prediction.projectedRank || '?'}</span>
              <span className="rank-label">Verwachte plek</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getReferenceLabel(reference) {
  const labels = {
    leader: 'vs Leider',
    pr: 'vs PR',
    seasonBest: 'vs SB',
    even: 'vs Vlak'
  }
  return labels[reference] || 'Verschil'
}

function calculateDiff(lap, skater, reference, standings, lapIndex) {
  if (!lap || lap.cumulative === undefined) return null

  switch (reference) {
    case 'leader':
      if (!standings || standings.length === 0) return null
      // Compare cumulative time to leader's pace
      const leaderTime = standings[0]?.time
      if (!leaderTime) return null
      const totalLaps = skater.totalLaps || skater.laps?.length || 1
      const leaderPacePerLap = leaderTime / totalLaps
      const expectedLeaderCum = leaderPacePerLap * (lapIndex + 1)
      return lap.cumulative - expectedLeaderCum

    case 'pr':
      if (!skater.pr) return null
      const prPacePerLap = skater.pr / (skater.totalLaps || 1)
      const expectedPrCum = prPacePerLap * (lapIndex + 1)
      return lap.cumulative - expectedPrCum

    case 'seasonBest':
      if (!skater.seasonBest) return null
      const sbPacePerLap = skater.seasonBest / (skater.totalLaps || 1)
      const expectedSbCum = sbPacePerLap * (lapIndex + 1)
      return lap.cumulative - expectedSbCum

    case 'even':
      // Even pace based on current average
      const avgPace = lap.cumulative / (lapIndex + 1)
      const prevAvg = lapIndex > 0
        ? skater.laps[lapIndex - 1].cumulative / lapIndex
        : avgPace
      return lap.time - prevAvg

    default:
      return null
  }
}

function getDiffClass(diff) {
  if (diff === null || diff === undefined) return 'diff-neutral'
  if (diff > 0.1) return 'diff-positive'
  if (diff < -0.1) return 'diff-negative'
  return 'diff-neutral'
}
