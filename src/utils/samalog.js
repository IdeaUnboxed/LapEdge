/**
 * Samalog calculations for frontend
 * Mirrors backend calculations for consistency
 */

/**
 * Convert distance in meters to kilometers
 */
export function distanceToKm(distanceMeters) {
  return distanceMeters / 1000
}

/**
 * Calculate Samalog points for a given time and distance
 * @param {number} timeMs - Time in milliseconds
 * @param {number} distanceMeters - Distance in meters
 * @returns {number|null} - Samalog points (lower is better)
 */
export function samalogPoints(timeMs, distanceMeters) {
  if (!timeMs || timeMs <= 0) return null
  if (!distanceMeters || distanceMeters <= 0) return null

  const timeSeconds = timeMs / 1000
  const distanceKm = distanceToKm(distanceMeters)

  return timeSeconds / distanceKm
}

/**
 * Calculate time needed to achieve target points on a distance
 * @param {number} targetPoints - Target Samalog points
 * @param {number} distanceMeters - Distance in meters
 * @returns {number|null} - Time in milliseconds
 */
export function pointsToTime(targetPoints, distanceMeters) {
  if (!targetPoints || targetPoints <= 0) return null
  if (!distanceMeters || distanceMeters <= 0) return null

  const distanceKm = distanceToKm(distanceMeters)
  const timeSeconds = targetPoints * distanceKm

  return timeSeconds * 1000
}

/**
 * Calculate time difference needed to gain/lose points on a distance
 * @param {number} pointsDelta - Points to gain (negative) or lose (positive)
 * @param {number} distanceMeters - Distance in meters
 * @returns {number} - Time delta in milliseconds (negative = need to go faster)
 */
export function pointsToTimeDelta(pointsDelta, distanceMeters) {
  if (!pointsDelta) return 0
  if (!distanceMeters || distanceMeters <= 0) return null

  const distanceKm = distanceToKm(distanceMeters)
  const timeSeconds = pointsDelta * distanceKm

  return timeSeconds * 1000
}

/**
 * Calculate time needed to lead (become #1)
 * @param {number} pointsGap - Points behind leader (positive = behind, negative = ahead)
 * @param {number} distanceMeters - Current distance in meters
 * @returns {number|null} - Time delta in milliseconds (negative = need to be faster)
 */
export function timeNeededToLead(pointsGap, distanceMeters) {
  if (pointsGap === 0) return 0 // Already leading
  if (pointsGap < 0) return 0 // Already ahead

  // Need to make up pointsGap, so need to go faster (negative time)
  return -pointsToTimeDelta(pointsGap, distanceMeters)
}

/**
 * Format Samalog points for display
 * @param {number} points - Samalog points
 * @returns {string} - Formatted points (e.g., "145.234")
 */
export function formatPoints(points) {
  if (points === null || points === undefined) return '–'
  return points.toFixed(3)
}

/**
 * Format points gap for display
 * @param {number} gap - Gap to leader in points
 * @returns {string} - Formatted gap (e.g., "+2.345")
 */
export function formatPointsGap(gap) {
  if (gap === null || gap === undefined || gap === 0) return '0.000'
  const sign = gap > 0 ? '+' : ''
  return `${sign}${gap.toFixed(3)}`
}

/**
 * Determine color class for time goal based on PR feasibility
 * @param {number} neededTimeMs - Time needed to achieve goal
 * @param {number} prTimeMs - Personal record time
 * @param {number} currentTimeMs - Current cumulative time (optional, for ongoing race)
 * @returns {string} - Color class: 'good', 'warning', or 'danger'
 */
export function getTimeGoalColor(neededTimeMs, prTimeMs, currentTimeMs = null) {
  if (!neededTimeMs || !prTimeMs) return 'neutral'

  // If in ongoing race, check if on track
  if (currentTimeMs) {
    const diff = currentTimeMs - neededTimeMs
    if (diff < 0) return 'good' // Ahead of schedule
    if (diff < 500) return 'warning' // Close
    return 'danger' // Behind
  }

  // Otherwise compare with PR
  const diff = Math.abs(neededTimeMs) - prTimeMs
  if (diff < -1000) return 'good' // Goal is slower than PR (easy)
  if (diff < 1000) return 'warning' // Close to PR (doable but tight)
  return 'danger' // Goal faster than PR (very difficult)
}
