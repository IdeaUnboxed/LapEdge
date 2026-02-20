import { ISUResultsAdapter } from '../adapters/isuresults.js'
import { SchaatsenNLAdapter } from '../adapters/schaatsenNL.js'
import { EventsConfig } from '../config/events.js'

const PROVIDER_TIMEOUT_MS = 20000 // Hard cap so we never hang on a slow provider

export class LiveDataService {
  constructor() {
    this.adapters = {
      isuresults: new ISUResultsAdapter(),
      schaatsen: new SchaatsenNLAdapter()
    }
    this.cache = new Map()
    this.cacheTimeout = 5000 // 5 seconds cache to reduce ISU server load
  }

  async withProviderTimeout(promise, fallback) {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('PROVIDER_TIMEOUT')), PROVIDER_TIMEOUT_MS)
    )
    return Promise.race([promise, timeout]).catch(err => {
      if (err.message === 'PROVIDER_TIMEOUT') {
        console.warn('[LiveData] Provider timeout, returning waiting state')
        return fallback()
      }
      throw err
    })
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

  getCacheKey(eventId, distance, type, gender = 'women') {
    return `${eventId}-${distance}-${gender}-${type}`
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

  async getRaceData(eventId, distance, gender = 'women') {
    const cacheKey = this.getCacheKey(eventId, distance, 'race', gender)
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    const adapter = this.getAdapter(eventId)
    const event = EventsConfig.getEvent(eventId)
    const distanceConfig = EventsConfig.getDistanceConfig(distance)

    const data = await this.withProviderTimeout(
      adapter.fetchRaceData(event, distance, gender),
      () => adapter.getWaitingData(event, distance)
    )

    // Normalize and enrich data
    const normalized = this.normalizeRaceData(data, distanceConfig)
    this.setCache(cacheKey, normalized)

    return normalized
  }

  async getStandings(eventId, distance, gender = 'women') {
    const cacheKey = this.getCacheKey(eventId, distance, 'standings', gender)
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    const adapter = this.getAdapter(eventId)
    const event = EventsConfig.getEvent(eventId)

    const standings = await this.withProviderTimeout(
      adapter.fetchStandings(event, distance, gender),
      () => ({ distance, standings: [] })
    )
    this.setCache(cacheKey, standings)

    return standings
  }

  normalizeRaceData(data, distanceConfig) {
    // Preserve special statuses (not_started, ended, waiting with event info)
    if (!data || !data.currentRace) {
      if (data?.status === 'not_started' || data?.status === 'ended') {
        return data  // Return as-is with event/competition info
      }
      return {
        status: data?.status || 'waiting',
        message: data?.message,
        event: data?.event,
        competition: data?.competition,
        isuUrl: data?.isuUrl,
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
      status: data.status || currentRace.status || 'racing',
      currentRace,
      distanceConfig,
      reskates: data.reskates || [],
      timestamp: Date.now()
    }
  }
}
