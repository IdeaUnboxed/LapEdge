/**
 * Meerkamp (All-around) Standings Service
 * Tracks cumulative Samalog points across multiple distances for championship events
 */

import { LiveDataService } from './liveData.js'
import { EventsConfig } from '../config/events.js'
import { samalogPoints, isDNSorDNF, pointsToTimeDelta } from '../utils/samalog.js'

export class MeerkampStandingsService {
  constructor() {
    this.liveDataService = new LiveDataService()
    // Cache: key = "eventId:gender", value = { distances: [...], skaters: Map<skaterId, data> }
    this.cache = new Map()
    this.cacheTTL = 30000 // 30 seconds
  }

  /**
   * Get cache key for event + gender
   */
  getCacheKey(eventId, gender) {
    return `${eventId}:${gender}`
  }

  /**
   * Get meerkamp standings for an event
   * @param {string} eventId
   * @param {string} gender - 'men' or 'women'
   * @param {number|null} afterDistance - Optional: get standings after specific distance (historical)
   * @returns {Promise<object>} - Standings object
   */
  async getStandings(eventId, gender = 'men', afterDistance = null) {
    const event = EventsConfig.getEvent(eventId)
    if (!event) {
      throw new Error(`Event not found: ${eventId}`)
    }

    const eventType = EventsConfig.getEventType(event)
    if (eventType === 'distances') {
      throw new Error(`Event ${eventId} is not a meerkamp event`)
    }

    // Get meerkamp distances in correct order
    const meerkampDistances = EventsConfig.getMeerkampDistances(eventId, gender)
    if (!meerkampDistances) {
      throw new Error(`No meerkamp distances for ${eventId} ${gender}`)
    }

    // Determine which distances to include
    const distancesToInclude = afterDistance
      ? this.getDistancesUntil(meerkampDistances, afterDistance)
      : meerkampDistances

    // Get standings for each distance
    const distanceResults = await this.fetchDistanceResults(
      eventId,
      distancesToInclude,
      gender
    )

    // Calculate cumulative standings
    const standings = this.calculateCumulativeStandings(
      distanceResults,
      meerkampDistances,
      distancesToInclude
    )

    // Determine current distance and status
    const currentDistance = this.getCurrentDistance(
      meerkampDistances,
      distanceResults
    )

    const currentRaceStatus = currentDistance
      ? await this.getRaceStatus(eventId, currentDistance, gender)
      : 'completed'

    return {
      eventId,
      gender,
      eventType,
      allDistances: meerkampDistances,
      completedDistances: distancesToInclude,
      currentDistance,
      currentRaceStatus,
      standings: standings.map((s, index) => ({
        rank: index + 1,
        ...s
      })),
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Get distances up to and including a specific distance
   */
  getDistancesUntil(allDistances, targetDistance) {
    const index = allDistances.indexOf(targetDistance)
    if (index === -1) return allDistances
    return allDistances.slice(0, index + 1)
  }

  /**
   * Fetch standings for multiple distances
   */
  async fetchDistanceResults(eventId, distances, gender) {
    const results = new Map()

    for (const distance of distances) {
      try {
        const standings = await this.liveDataService.getStandings(
          eventId,
          distance,
          gender
        )

        if (standings && Array.isArray(standings)) {
          results.set(distance, standings)
        }
      } catch (error) {
        console.warn(
          `[Meerkamp] Could not fetch ${distance}m for ${eventId}:`,
          error.message
        )
        // Continue with other distances
      }
    }

    return results
  }

  /**
   * Calculate cumulative Samalog standings
   */
  calculateCumulativeStandings(distanceResults, allDistances, completedDistances) {
    const skaters = new Map()

    // Process each completed distance
    for (const distance of completedDistances) {
      const results = distanceResults.get(distance)
      if (!results) continue

      for (const result of results) {
        const skaterId = result.skaterId || result.name
        if (!skaterId) continue

        // Initialize skater if not exists
        if (!skaters.has(skaterId)) {
          skaters.set(skaterId, {
            skaterId,
            name: result.name,
            country: result.country,
            distances: [],
            pointsFinished: 0,
            pointsVirtual: 0,
            dnf: false
          })
        }

        const skater = skaters.get(skaterId)

        // Check for DNF/DNS
        if (isDNSorDNF(result)) {
          skater.dnf = true
          skater.distances.push({
            distance,
            time: null,
            points: null,
            status: 'DNF'
          })
          continue
        }

        // Calculate Samalog points
        const points = samalogPoints(result.time, distance)
        if (points) {
          skater.pointsFinished += points
          skater.pointsVirtual += points
          skater.distances.push({
            distance,
            time: result.time,
            points,
            status: 'finished'
          })
        }
      }
    }

    // Convert to array and sort by points (lower is better)
    const standings = Array.from(skaters.values())

    // Separate DNF skaters
    const activeSkaters = standings.filter(s => !s.dnf)
    const dnfSkaters = standings.filter(s => s.dnf)

    // Sort active skaters by points
    activeSkaters.sort((a, b) => a.pointsVirtual - b.pointsVirtual)

    // Calculate gap to first
    if (activeSkaters.length > 0) {
      const leaderPoints = activeSkaters[0].pointsVirtual
      activeSkaters.forEach(skater => {
        skater.gapToFirst = skater.pointsVirtual - leaderPoints
      })
    }

    // Add remaining distances
    const remainingDistances = allDistances.filter(
      d => !completedDistances.includes(d)
    )
    activeSkaters.forEach(skater => {
      skater.remainingDistances = remainingDistances
    })
    dnfSkaters.forEach(skater => {
      skater.remainingDistances = remainingDistances
    })

    // Return active skaters first, then DNF
    return [...activeSkaters, ...dnfSkaters]
  }

  /**
   * Determine current distance being raced
   */
  getCurrentDistance(allDistances, distanceResults) {
    for (const distance of allDistances) {
      if (!distanceResults.has(distance)) {
        return distance
      }
    }
    return null // All distances completed
  }

  /**
   * Get race status for a distance
   */
  async getRaceStatus(eventId, distance, gender) {
    try {
      const raceData = await this.liveDataService.getRaceData(
        eventId,
        distance,
        gender
      )
      return raceData?.status || 'waiting'
    } catch (error) {
      return 'unknown'
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear()
  }
}
