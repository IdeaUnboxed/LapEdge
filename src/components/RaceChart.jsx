import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { formatTime } from '../utils/timeFormat'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export function RaceChart({ skaters, standings, distance, reference }) {
  const chartData = useMemo(() => {
    if (!skaters || skaters.length === 0) {
      return null
    }

    // Get max laps from any skater
    const maxLaps = Math.max(...skaters.map(s => s.laps?.length || 0))
    const labels = Array.from({ length: maxLaps }, (_, i) => `Ronde ${i + 1}`)

    const datasets = skaters.map((skater, index) => {
      const color = index === 0 ? '#3b82f6' : '#ef4444'

      // Calculate cumulative differences vs reference
      const data = skater.laps?.map((lap, lapIndex) => {
        return getDiffFromReference(lap, skater, reference, standings, lapIndex)
      }) || []

      return {
        label: skater.name,
        data: data,
        borderColor: color,
        backgroundColor: `${color}20`,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false
      }
    })

    // Add reference line at 0
    datasets.push({
      label: getReferenceLabel(reference),
      data: Array(maxLaps).fill(0),
      borderColor: '#6b7280',
      borderDash: [5, 5],
      pointRadius: 0,
      fill: false
    })

    return {
      labels,
      datasets
    }
  }, [skaters, standings, reference])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#a0a0b0',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1a1a24',
        titleColor: '#ffffff',
        bodyColor: '#a0a0b0',
        borderColor: '#2a2a3a',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y
            const prefix = value >= 0 ? '+' : ''
            return `${context.dataset.label}: ${prefix}${value.toFixed(2)}s`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#2a2a3a'
        },
        ticks: {
          color: '#606070'
        }
      },
      y: {
        grid: {
          color: '#2a2a3a'
        },
        ticks: {
          color: '#606070',
          callback: (value) => {
            const prefix = value >= 0 ? '+' : ''
            return `${prefix}${value.toFixed(1)}s`
          }
        },
        title: {
          display: true,
          text: 'Verschil (s)',
          color: '#606070'
        }
      }
    }
  }

  if (!chartData) {
    return null
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">Verloop vs {getReferenceLabel(reference)}</h3>
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

function getDiffFromReference(lap, skater, reference, standings, lapIndex) {
  if (!lap || lap.cumulative === undefined) return null

  const totalLaps = skater.totalLaps || skater.laps?.length || 1

  switch (reference) {
    case 'leader':
      if (!standings || standings.length === 0) return 0
      const leaderTime = standings[0]?.time
      if (!leaderTime) return 0
      const leaderPacePerLap = leaderTime / totalLaps
      const expectedLeaderCum = leaderPacePerLap * (lapIndex + 1)
      return lap.cumulative - expectedLeaderCum

    case 'pr':
      if (!skater.pr) return 0
      const prPacePerLap = skater.pr / totalLaps
      const expectedPrCum = prPacePerLap * (lapIndex + 1)
      return lap.cumulative - expectedPrCum

    case 'seasonBest':
      if (!skater.seasonBest) return 0
      const sbPacePerLap = skater.seasonBest / totalLaps
      const expectedSbCum = sbPacePerLap * (lapIndex + 1)
      return lap.cumulative - expectedSbCum

    case 'even':
      // Even pace based on average so far
      const avgPace = lap.cumulative / (lapIndex + 1)
      return lap.time - avgPace

    default:
      return 0
  }
}

function getReferenceLabel(reference) {
  const labels = {
    leader: 'Leider',
    pr: 'PR',
    seasonBest: 'Seizoensbeste',
    even: 'Vlak schema'
  }
  return labels[reference] || 'Referentie'
}
