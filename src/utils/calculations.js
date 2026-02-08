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
 * Uses leader's passage times as reference and analyzes trend in time differences
 */
export function predictFinishTime(skater, distance, distanceConfig, leader = null, standings = null) {
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
      projectedRank: skater.rank || null
    }
  }

  const remainingLaps = totalLaps - completedLaps
  
  let prediction
  // Method 1: Use leader's passage times as reference (preferred)
  if (leader?.passageTimes && leader.passageTimes.length >= totalLaps && leader.time) {
    prediction = predictFromLeader(skater, leader, totalLaps, completedLaps, remainingLaps)
  } else {
    // Method 2: Use historical profiles per distance (fallback)
    prediction = predictFromProfile(skater, distance, totalLaps, completedLaps, remainingLaps)
  }
  
  // Calculate projected rank based on standings
  if (prediction && standings && standings.length > 0) {
    prediction.projectedRank = calculateProjectedRank(prediction.time, standings)
  }
  
  return prediction
}

/**
 * Calculate projected rank based on predicted time vs standings
 */
function calculateProjectedRank(predictedTime, standings) {
  if (!standings || standings.length === 0) return null
  
  // Count how many finished skaters are faster
  let rank = 1
  for (const entry of standings) {
    if (entry.time && entry.time < predictedTime) {
      rank++
    }
  }
  
  return rank
}

/**
 * Predict using leader's actual passage times
 * Analyzes the trend in time differences (gaining or losing time?)
 */
function predictFromLeader(skater, leader, totalLaps, completedLaps, remainingLaps) {
  const skaterPassages = skater.passageTimes || skater.laps.map(l => l.cumulative)
  const leaderPassages = leader.passageTimes
  
  // Calculate difference at each passage point
  const diffs = skaterPassages.map((time, i) => time - leaderPassages[i])
  
  // Current difference from leader
  const currentDiff = diffs[diffs.length - 1]
  
  // Analyze trend: is the skater gaining or losing time?
  let trendPerLap = 0
  if (diffs.length >= 3) {
    // Use last 3-5 diffs to calculate trend
    const recentDiffs = diffs.slice(-Math.min(5, diffs.length))
    const diffChanges = []
    for (let i = 1; i < recentDiffs.length; i++) {
      diffChanges.push(recentDiffs[i] - recentDiffs[i-1])
    }
    trendPerLap = diffChanges.reduce((a, b) => a + b, 0) / diffChanges.length
  } else if (diffs.length >= 2) {
    trendPerLap = (diffs[diffs.length - 1] - diffs[0]) / (diffs.length - 1)
  }
  
  // Project final difference: current diff + trend * remaining laps
  // Apply some dampening to the trend (fatigue effects are not linear)
  const dampenedTrend = trendPerLap * 0.8
  const projectedFinalDiff = currentDiff + (dampenedTrend * remainingLaps)
  
  // Predicted finish time = leader's time + projected difference
  const projectedTime = leader.time + projectedFinalDiff
  
  // Margin based on trend uncertainty and remaining distance
  const trendVariance = calculateVariance(diffs.slice(1).map((d, i) => d - diffs[i]))
  const margin = Math.sqrt(Math.max(trendVariance, 0.1) * remainingLaps) * 1.5
  
  return {
    time: projectedTime,
    margin: Math.max(margin, 0.5),
    projectedRank: null,
    method: 'leader'
  }
}

/**
 * Predict using typical lap profiles per distance (fallback when no leader)
 * Accounts for typical lap time progression (fatigue)
 */
function predictFromProfile(skater, distance, totalLaps, completedLaps, remainingLaps) {
  // Typical percentage increase per lap due to fatigue
  // These are approximate and vary by skater/conditions
  const fatigueProfiles = {
    1500: { baseIncrease: 0.005, acceleration: 0.002 },  // ~0.5% per lap, accelerating
    3000: { baseIncrease: 0.004, acceleration: 0.001 },  // ~0.4% per lap
    5000: { baseIncrease: 0.003, acceleration: 0.0008 }, // ~0.3% per lap
    10000: { baseIncrease: 0.002, acceleration: 0.0005 } // ~0.2% per lap
  }
  
  const profile = fatigueProfiles[distance] || { baseIncrease: 0.003, acceleration: 0.001 }
  
  // Get recent lap times (excluding opening)
  const normalLaps = skater.laps.slice(1)
  if (normalLaps.length === 0) {
    // Only opening lap - rough estimate
    const estimatedNormalLap = skater.laps[0].time * 1.55
    return {
      time: skater.currentCumulative + estimatedNormalLap * remainingLaps * 1.02,
      margin: remainingLaps * 0.5,
      projectedRank: null,
      method: 'estimate'
    }
  }
  
  // Use most recent lap as base, then apply fatigue model
  const lastLapTime = normalLaps[normalLaps.length - 1].time
  
  let projectedRemaining = 0
  for (let i = 0; i < remainingLaps; i++) {
    const lapNumber = completedLaps + i + 1
    const fatigueMultiplier = 1 + profile.baseIncrease + (profile.acceleration * (lapNumber - 2))
    projectedRemaining += lastLapTime * fatigueMultiplier
  }
  
  const projectedTime = skater.currentCumulative + projectedRemaining
  
  // Calculate margin from variance in recent laps
  const variance = calculateVariance(normalLaps.map(l => l.time))
  const margin = Math.sqrt(Math.max(variance, 0.3) * remainingLaps) * 1.5
  
  return {
    time: projectedTime,
    margin: Math.max(margin, 0.5),
    projectedRank: null,
    method: 'profile'
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
 * Note: These are passage counts (times crossing finish line)
 * First passage is ~100m opening, rest are 400m laps
 */
function getTotalLaps(distance) {
  const lapsMap = {
    500: 2,      // 100m + 400m
    1000: 3,     // 100m + 2x400m + 100m (3 passages)
    1500: 4,     // 100m + 3x400m + 100m (4 passages)
    3000: 8,     // 100m + 7x400m + 100m (8 passages)
    5000: 13,    // 100m + 12x400m + 100m (13 passages)
    10000: 25    // 100m + 24x400m + 100m (25 passages)
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
