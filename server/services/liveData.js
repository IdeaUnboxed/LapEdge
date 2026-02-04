import { ISUResultsAdapter } from '../adapters/isuresults.js'
import { SchaatsenNLAdapter } from '../adapters/schaatsenNL.js'
import { EventsConfig } from '../config/events.js'

export class LiveDataService {
  constructor() {
    this.adapters = {
      isuresults: new ISUResultsAdapter(),
      schaatsen: new SchaatsenNLAdapter()
    }
    this.cache = new Map()
    this.cacheTimeout = 2000 // 2 seconds cache
  }

  getAdapter(eventId) {
    const event = EventsConfig.getEvent(eventId)
    if (!event) {
      throw new Error(`Unknown event: ${eventId}`)
    }
    const adapter = this.adapters[event.source]
    if (!adapter) {
      throw new Error(`No adapter for source: ${event.source}`)
    }
    return adapter
  }

  getCacheKey(eventId, distance, type) {
    return `${eventId}-${distance}-${type}`
  }

  getFromCache(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }
    return null
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  async getRaceData(eventId, distance) {
    const cacheKey = this.getCacheKey(eventId, distance, 'race')
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    const adapter = this.getAdapter(eventId)
    const event = EventsConfig.getEvent(eventId)
    const distanceConfig = EventsConfig.getDistanceConfig(distance)

    const data = await adapter.fetchRaceData(event, distance)

    // Normalize and enrich data
    const normalized = this.normalizeRaceData(data, distanceConfig)
    this.setCache(cacheKey, normalized)

    return normalized
  }

  async getStandings(eventId, distance) {
    const cacheKey = this.getCacheKey(eventId, distance, 'standings')
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    const adapter = this.getAdapter(eventId)
    const event = EventsConfig.getEvent(eventId)

    const standings = await adapter.fetchStandings(event, distance)
    this.setCache(cacheKey, standings)

    return standings
  }

  normalizeRaceData(data, distanceConfig) {
    if (!data || !data.currentRace) {
      return {
        status: 'waiting',
        currentRace: null,
        standings: []
      }
    }

    const { currentRace } = data

    // Calculate cumulative times and lap splits
    if (currentRace.skaters) {
      currentRace.skaters = currentRace.skaters.map(skater => {
        const lapTimes = skater.lapTimes || []
        let cumulative = 0
        const laps = lapTimes.map((time, index) => {
          cumulative += time
          return {
            lap: index + 1,
            time: time,
            cumulative: cumulative,
            pace: cumulative / (index + 1)
          }
        })

        return {
          ...skater,
          laps,
          totalLaps: distanceConfig?.laps || lapTimes.length,
          completedLaps: lapTimes.length,
          currentCumulative: cumulative,
          isFinished: lapTimes.length >= (distanceConfig?.laps || Infinity)
        }
      })
    }

    return {
      status: currentRace.status || 'racing',
      currentRace,
      distanceConfig,
      timestamp: Date.now()
    }
  }
}
