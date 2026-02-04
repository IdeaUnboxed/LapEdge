import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

export class RecordsService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 3600000 // 1 hour cache for records
  }

  getCacheKey(skaterId, distance) {
    return `${skaterId}-${distance || 'all'}`
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

  async getSkaterRecords(skaterId, distance = null) {
    const cacheKey = this.getCacheKey(skaterId, distance)
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    // Try multiple sources
    let records = null

    try {
      records = await this.fetchFromSpeedSkatingResults(skaterId, distance)
    } catch (error) {
      console.log('SpeedSkatingResults unavailable, trying backup...')
    }

    if (!records) {
      try {
        records = await this.fetchFromSpeedSkatingNews(skaterId, distance)
      } catch (error) {
        console.log('SpeedSkatingNews unavailable, using demo data')
      }
    }

    if (!records) {
      records = this.getDemoRecords(skaterId, distance)
    }

    this.setCache(cacheKey, records)
    return records
  }

  async getSkaterInfo(skaterId) {
    const cacheKey = `info-${skaterId}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    // Fetch complete skater profile
    const records = await this.getSkaterRecords(skaterId)
    const info = {
      id: skaterId,
      records,
      lastUpdated: new Date().toISOString()
    }

    this.setCache(cacheKey, info)
    return info
  }

  async fetchFromSpeedSkatingResults(skaterId, distance) {
    // speedskatingresults.com integration
    // In production, would parse HTML or use API if available
    const url = `https://speedskatingresults.com/api/json/skater_lookup.php?familyname=${encodeURIComponent(skaterId)}`

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'LapEdge/1.0 (Personal use)',
          'Accept': 'application/json'
        },
        timeout: 5000
      })

      if (response.ok) {
        const data = await response.json()
        return this.transformSpeedSkatingResultsData(data, distance)
      }
    } catch (error) {
      throw new Error('SpeedSkatingResults fetch failed')
    }

    return null
  }

  async fetchFromSpeedSkatingNews(skaterId, distance) {
    // speedskatingnews.info backup source
    const url = `https://speedskatingnews.info/data/skater/${encodeURIComponent(skaterId)}`

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'LapEdge/1.0 (Personal use)'
        },
        timeout: 5000
      })

      if (response.ok) {
        const html = await response.text()
        return this.parseSpeedSkatingNewsHtml(html, distance)
      }
    } catch (error) {
      throw new Error('SpeedSkatingNews fetch failed')
    }

    return null
  }

  transformSpeedSkatingResultsData(data, distance) {
    // Transform speedskatingresults.com data format
    if (!data || !data.skaters || data.skaters.length === 0) {
      return null
    }

    const skater = data.skaters[0]
    const records = {}

    if (skater.records) {
      for (const record of skater.records) {
        if (!distance || record.distance === distance) {
          records[record.distance] = {
            pr: record.pb,
            seasonBest: record.sb,
            prDate: record.pb_date,
            sbDate: record.sb_date
          }
        }
      }
    }

    return {
      name: `${skater.givenname} ${skater.familyname}`,
      country: skater.country,
      records
    }
  }

  parseSpeedSkatingNewsHtml(html, distance) {
    const $ = cheerio.load(html)
    const records = {}

    // Parse tables for PR/SB data
    $('table.records tr').each((i, row) => {
      const cells = $(row).find('td')
      if (cells.length >= 3) {
        const dist = parseInt($(cells[0]).text())
        const pr = parseFloat($(cells[1]).text())
        const sb = parseFloat($(cells[2]).text())

        if (!isNaN(dist) && (!distance || dist === distance)) {
          records[dist] = { pr, seasonBest: sb }
        }
      }
    })

    const name = $('h1.skater-name').text().trim()
    const country = $('span.country').text().trim()

    return {
      name: name || 'Unknown',
      country: country || 'UNK',
      records
    }
  }

  getDemoRecords(skaterId, distance) {
    // Demo records for development
    const allRecords = {
      500: { pr: 34.32, seasonBest: 34.45, prDate: '2023-03-12', sbDate: '2024-11-15' },
      1000: { pr: 68.65, seasonBest: 68.89, prDate: '2023-02-18', sbDate: '2024-12-01' },
      1500: { pr: 103.45, seasonBest: 103.89, prDate: '2024-01-14', sbDate: '2024-11-23' },
      3000: { pr: 225.67, seasonBest: 226.12, prDate: '2023-12-08', sbDate: '2024-12-08' },
      5000: { pr: 380.12, seasonBest: 381.45, prDate: '2024-02-10', sbDate: '2024-11-30' },
      10000: { pr: 772.34, seasonBest: 775.89, prDate: '2023-11-25', sbDate: '2024-11-17' }
    }

    let records = allRecords
    if (distance) {
      records = { [distance]: allRecords[distance] }
    }

    return {
      name: skaterId,
      country: 'NED',
      records
    }
  }

  // Get lap split schedule for a reference time
  getLapSchedule(distance, targetTime) {
    const distanceConfig = {
      500: { laps: 1, openingLap: 100 },
      1000: { laps: 2.5, openingLap: 42 },
      1500: { laps: 3.75, openingLap: 26 },
      3000: { laps: 7.5, openingLap: 13 },
      5000: { laps: 12.5, openingLap: 8 },
      10000: { laps: 25, openingLap: 4 }
    }

    const config = distanceConfig[distance]
    if (!config) return null

    const fullLaps = Math.floor(config.laps)
    const hasHalfLap = config.laps % 1 !== 0

    // Calculate even pace per 400m
    const totalMeters = distance
    const pacePerLap = targetTime / config.laps

    const schedule = []
    let cumulative = 0

    // Opening 100m for certain distances
    if (hasHalfLap && distance !== 500) {
      const openingTime = pacePerLap * 0.25 * (config.openingLap / 100 + 1)
      cumulative += openingTime
      schedule.push({
        lap: 0.25,
        meters: 100,
        time: openingTime,
        cumulative
      })
    }

    // Full laps
    const startLap = hasHalfLap && distance !== 500 ? 1 : 0
    for (let i = startLap; i <= fullLaps; i++) {
      const lapTime = pacePerLap
      cumulative += lapTime
      schedule.push({
        lap: i + (hasHalfLap ? 0.25 : 0),
        meters: (i + 1) * 400 + (hasHalfLap ? 100 : 0),
        time: lapTime,
        cumulative
      })
    }

    return schedule
  }
}
