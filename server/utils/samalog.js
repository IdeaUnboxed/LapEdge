/**
 * Samalog (Sam Alles Logisch) points calculation for all-around skating
 *
 * Formula: p = time(seconds) / distance(km)
 * Lowest total points wins
 */

/**
 * Convert distance in meters to kilometers
 * @param {number} distanceMeters - Distance in meters (500, 1000, 1500, 3000, 5000, 10000)
 * @returns {number} - Distance in kilometers
 */
export function distanceToKm(distanceMeters) {
  return distanceMeters / 1000
}

/**
 * Calculate Samalog points for a given time and distance
 * @param {number} timeMs - Time in milliseconds
 * @param {number} distanceMeters - Distance in meters
 * @returns {number} - Samalog points (lower is better)
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
 * @returns {number} - Time in milliseconds
 */
export function pointsToTime(targetPoints, distanceMeters) {
  if (!targetPoints || targetPoints <= 0) return null
  if (!distanceMeters || distanceMeters <= 0) return null

  const distanceKm = distanceToKm(distanceMeters)
  const timeSeconds = targetPoints * distanceKm

  return timeSeconds * 1000 // Convert to milliseconds
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

  return timeSeconds * 1000 // Convert to milliseconds
}

/**
 * Check if a result is DNS (Did Not Start) or DNF (Did Not Finish)
 * @param {object} result - Race result object
 * @returns {boolean} - True if DNS/DNF
 */
export function isDNSorDNF(result) {
  if (!result) return true
  if (result.dnf === true) return true
  if (result.dns === true) return true
  if (result.status === 'DNF' || result.status === 'DNS') return true
  if (!result.time || result.time <= 0) return true
  return false
}

/**
 * Create a DNF/DNS marker for standings
 * @param {object} skater - Skater info
 * @returns {object} - DNF marker object
 */
export function createDNFMarker(skater) {
  return {
    skaterId: skater.id || skater.skaterId,
    name: skater.name,
    country: skater.country,
    dnf: true,
    pointsFinished: null,
    pointsVirtual: null
  }
}
