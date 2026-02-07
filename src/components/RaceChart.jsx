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

// Colors for different skaters
const COLORS = {
  current1: '#3b82f6',  // Blue - current skater 1
  current2: '#ef4444',  // Red - current skater 2
  top1: '#fbbf24',      // Gold - #1 (leader = reference line)
  top2: '#94a3b8',      // Silver - #2
  top3: '#b45309'       // Bronze - #3
}

export function RaceChart({ skaters, standings, distance, reference, top3, leader }) {
  const chartData = useMemo(() => {
    if (!skaters || skaters.length === 0 || !leader?.passageTimes) {
      return null
    }

    const leaderPassageTimes = leader.passageTimes
    const maxLaps = leaderPassageTimes.length
    const labels = Array.from({ length: maxLaps }, (_, i) => `${i + 1}`)

    const datasets = []

    // Leader reference line (always at 0)
    datasets.push({
      label: `🥇 ${leader.name} (${formatTime(leader.time)})`,
      data: Array(maxLaps).fill(0),
      borderColor: COLORS.top1,
      backgroundColor: `${COLORS.top1}20`,
      borderWidth: 3,
      borderDash: [8, 4],
      tension: 0,
      pointRadius: 0,
      fill: false,
      isLeader: true
    })

    // Add #2 and #3 from top3 (relative to leader)
    if (top3 && top3.length > 1) {
      const topColors = [null, COLORS.top2, COLORS.top3]  // skip index 0 (leader)
      const medals = [null, '🥈', '🥉']
      
      top3.slice(1, 3).forEach((topSkater, idx) => {
        const actualIdx = idx + 1  // 1 or 2
        if (topSkater.passageTimes?.length > 0) {
          // Check if this skater is in current race
          const isCurrentSkater = skaters.some(s => 
            s.name === topSkater.name || 
            (s.finalTime && Math.abs(s.finalTime - topSkater.time) < 0.01)
          )
          
          if (!isCurrentSkater) {
            // Calculate difference vs leader at each point
            const diffData = topSkater.passageTimes.map((time, i) => {
              return time - leaderPassageTimes[i]
            })
            
            datasets.push({
              label: `${medals[actualIdx]} ${topSkater.name} (+${(topSkater.time - leader.time).toFixed(2)}s)`,
              data: diffData,
              borderColor: topColors[actualIdx],
              backgroundColor: `${topColors[actualIdx]}20`,
              borderWidth: 2,
              borderDash: [5, 5],
              tension: 0.3,
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: false,
              lapTimes: topSkater.lapTimes,
              passageTimes: topSkater.passageTimes,
              finalTime: topSkater.time
            })
          }
        }
      })
    }

    // Add current racing skaters (solid lines, prominent)
    const currentColors = [COLORS.current1, COLORS.current2]
    skaters.forEach((skater, index) => {
      const passageTimes = skater.passageTimes || skater.laps?.map(l => l.cumulative) || []
      const lapTimes = skater.lapTimes || skater.laps?.map(l => l.time) || []
      
      if (passageTimes.length > 0) {
        // Calculate difference vs leader at each point
        const diffData = passageTimes.map((time, i) => {
          if (i < leaderPassageTimes.length) {
            return time - leaderPassageTimes[i]
          }
          return null
        })
        
        const finalDiff = skater.finalTime ? skater.finalTime - leader.time : null
        const diffLabel = finalDiff !== null 
          ? (finalDiff >= 0 ? `+${finalDiff.toFixed(2)}s` : `${finalDiff.toFixed(2)}s`)
          : ''
        
        datasets.push({
          label: `${skater.name} (${skater.country}) ${diffLabel}`,
          data: diffData,
          borderColor: currentColors[index],
          backgroundColor: `${currentColors[index]}30`,
          borderWidth: 3,
          tension: 0.3,
          pointRadius: 6,
          pointHoverRadius: 10,
          fill: false,
          lapTimes: lapTimes,
          passageTimes: passageTimes,
          finalTime: skater.finalTime,
          isCurrentSkater: true
        })
      }
    })

    return {
      labels,
      datasets
    }
  }, [skaters, top3, leader])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#a0a0b0',
          font: {
            family: "'Inter', sans-serif",
            size: 13
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#1a1a24',
        titleColor: '#ffffff',
        bodyColor: '#a0a0b0',
        borderColor: '#2a2a3a',
        borderWidth: 1,
        padding: 14,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          title: (items) => {
            if (items.length === 0) return ''
            return `Ronde ${items[0].label}`
          },
          label: (context) => {
            const dataset = context.dataset
            const lapIndex = context.dataIndex
            const diff = context.parsed.y
            
            if (dataset.isLeader) {
              return `${dataset.label}: referentie`
            }
            
            // Format difference
            const diffStr = diff >= 0 ? `+${diff.toFixed(2)}s` : `${diff.toFixed(2)}s`
            
            // Get lap time if available
            const lapTime = dataset.lapTimes?.[lapIndex]
            const lapStr = lapTime ? ` │ ronde: ${lapTime.toFixed(2)}s` : ''
            
            // Get passage time
            const passage = dataset.passageTimes?.[lapIndex]
            const passageStr = passage ? ` │ cum: ${formatTime(passage)}` : ''
            
            return `${dataset.label.split(' (')[0]}: ${diffStr}${lapStr}${passageStr}`
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ronde',
          color: '#808090',
          font: { size: 14 }
        },
        grid: {
          color: '#2a2a3a'
        },
        ticks: {
          color: '#808090',
          font: { size: 13 }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Verschil t.o.v. leider (s)',
          color: '#808090',
          font: { size: 14 }
        },
        grid: {
          color: '#2a2a3a',
          // Highlight the zero line
          lineWidth: (context) => context.tick.value === 0 ? 2 : 1
        },
        ticks: {
          color: '#808090',
          font: { size: 12 },
          callback: (value) => {
            const prefix = value >= 0 ? '+' : ''
            return `${prefix}${value.toFixed(1)}s`
          }
        }
      }
    }
  }), [])

  if (!chartData || chartData.datasets.length === 0) {
    return null
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">Race verloop - Verschil t.o.v. leider per ronde</h3>
      <div style={{ height: '400px' }}>
        <Line data={chartData} options={options} />
      </div>
      <div className="chart-legend-help">
        <span className="legend-leader">━ ━ Leider (referentie)</span>
        <span className="legend-current">━━ Huidige rit</span>
        <span className="legend-top3">┅┅ Top 3</span>
      </div>
    </div>
  )
}
