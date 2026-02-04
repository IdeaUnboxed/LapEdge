/**
 * Calculate virtual ranking based on current cumulative time vs finished skaters
 */
export function calculateVirtualRank(skater, standings) {
  if (!skater || !skater.currentCumulative || !standings || standings.length === 0) {
    return null
  }

  // For finished skaters, use actual rank
  if (skater.isFinished) {
    const rank = standings.findIndex(s => s.time >= skater.currentCumulative) + 1
    return rank > 0 ? rank : standings.length + 1
  }

  // For in-progress, project based on current pace
  const totalLaps = skater.totalLaps || 1
  const completedLaps = skater.completedLaps || skater.laps?.length || 0

  if (completedLaps === 0) return null

  // Simple linear projection
  const projectedTime = (skater.currentCumulative / completedLaps) * totalLaps

  // Find virtual rank among finished times
  let rank = 1
  for (const entry of standings) {
    if (entry.time < projectedTime) {
      rank++
    } else {
      break
    }
  }

  return rank
}

/**
 * Predict finish time based on current laps
 * Uses weighted average favoring recent laps
 */
export function predictFinishTime(skater, distance, distanceConfig) {
  if (!skater || !skater.laps || skater.laps.length === 0) {
    return null
  }

  const totalLaps = distanceConfig?.laps || getTotalLaps(distance)
  const completedLaps = skater.laps.length

  if (completedLaps === 0) return null

  // If finished, return actual time
  if (skater.isFinished) {
    return {
      time: skater.currentCumulative,
      margin: 0,
      projectedRank: null
    }
  }

  // Weight recent laps more heavily
  let weightedSum = 0
  let weightTotal = 0

  skater.laps.forEach((lap, index) => {
    // Exponential weighting: more recent laps have higher weight
    const weight = Math.pow(1.5, index)
    weightedSum += lap.time * weight
    weightTotal += weight
  })

  const weightedAvgLap = weightedSum / weightTotal

  // Account for opening lap being faster (for distances starting with 100m)
  const remainingLaps = totalLaps - completedLaps
  const projectedRemaining = weightedAvgLap * remainingLaps

  const projectedTotal = skater.currentCumulative + projectedRemaining

  // Calculate uncertainty based on variance in lap times
  const lapTimes = skater.laps.map(l => l.time)
  const variance = calculateVariance(lapTimes)
  const margin = Math.sqrt(variance * remainingLaps) * 1.5 // 1.5 sigma

  return {
    time: projectedTotal,
    margin: margin,
    projectedRank: null // Could calculate based on standings
  }
}

/**
 * Calculate variance of an array of numbers
 */
function calculateVariance(values) {
  if (!values || values.length < 2) return 0

  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2))
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length
}

/**
 * Get total laps for a distance
 */
function getTotalLaps(distance) {
  const lapsMap = {
    500: 1,
    1000: 2.5,
    1500: 3.75,
    3000: 7.5,
    5000: 12.5,
    10000: 25
  }
  return lapsMap[distance] || 1
}

/**
 * Calculate lap schedule for even pacing
 */
export function calculateEvenPaceSchedule(targetTime, distance) {
  const totalLaps = getTotalLaps(distance)
  const timePerLap = targetTime / totalLaps

  const schedule = []
  let cumulative = 0

  for (let i = 1; i <= Math.ceil(totalLaps); i++) {
    const lapTime = i <= totalLaps ? timePerLap : timePerLap * (totalLaps % 1)
    cumulative += lapTime
    schedule.push({
      lap: i,
      time: lapTime,
      cumulative: cumulative
    })
  }

  return schedule
}

/**
 * Compare current performance to a reference schedule
 */
export function compareToSchedule(skater, schedule) {
  if (!skater?.laps || !schedule) return []

  return skater.laps.map((lap, index) => {
    const scheduleLap = schedule[index]
    if (!scheduleLap) return { ...lap, diff: null }

    return {
      ...lap,
      diff: lap.cumulative - scheduleLap.cumulative,
      scheduleCum: scheduleLap.cumulative
    }
  })
}
