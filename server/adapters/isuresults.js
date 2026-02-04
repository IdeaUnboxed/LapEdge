import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

export class ISUResultsAdapter {
  constructor() {
    this.baseUrl = 'https://live.isuresults.eu'
  }

  async fetchRaceData(event, distance) {
    // In production, this would fetch from live.isuresults.eu
    // For now, return mock data structure that can be replaced
    try {
      // Attempt to fetch real data
      const url = `${event.sourceUrl}/api/skating/race/${distance}`
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LapEdge/1.0 (Personal use)'
        },
        timeout: 5000
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      // Fall back to demo data
      console.log('Using demo data for ISU Results')
    }

    // Return demo data for development
    return this.getDemoRaceData(distance)
  }

  async fetchStandings(event, distance) {
    try {
      const url = `${event.sourceUrl}/api/skating/standings/${distance}`
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LapEdge/1.0 (Personal use)'
        },
        timeout: 5000
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.log('Using demo standings for ISU Results')
    }

    return this.getDemoStandings(distance)
  }

  getDemoRaceData(distance) {
    const lapsForDistance = {
      500: 1,
      1000: 2.5,
      1500: 3.75,
      3000: 7.5,
      5000: 12.5,
      10000: 25
    }

    const totalLaps = lapsForDistance[distance] || 1
    const currentLap = Math.min(Math.floor(Math.random() * totalLaps) + 1, Math.floor(totalLaps))

    // Generate realistic lap times based on distance
    const generateLapTimes = (basePace, variation, count) => {
      const times = []
      for (let i = 0; i < count; i++) {
        const time = basePace + (Math.random() - 0.5) * variation
        times.push(Math.round(time * 1000) / 1000)
      }
      return times
    }

    const basePaces = {
      500: 9.5,
      1000: 13.5,
      1500: 27.5,
      3000: 28.5,
      5000: 29.5,
      10000: 30.5
    }

    return {
      status: 'racing',
      currentRace: {
        pairNumber: Math.floor(Math.random() * 10) + 1,
        status: 'in_progress',
        distance: distance,
        skaters: [
          {
            id: 'demo-1',
            name: 'Patrick Roest',
            country: 'NED',
            lane: 'inner',
            lapTimes: generateLapTimes(basePaces[distance] || 28, 1.5, currentLap),
            pr: this.getDemoPR(distance),
            seasonBest: this.getDemoSB(distance)
          },
          {
            id: 'demo-2',
            name: 'Nils van der Poel',
            country: 'SWE',
            lane: 'outer',
            lapTimes: generateLapTimes(basePaces[distance] || 28, 1.5, currentLap),
            pr: this.getDemoPR(distance),
            seasonBest: this.getDemoSB(distance)
          }
        ]
      }
    }
  }

  getDemoStandings(distance) {
    const times = {
      500: [34.32, 34.45, 34.58, 34.71, 34.89, 35.02],
      1000: [68.45, 68.78, 69.01, 69.24, 69.56, 69.89],
      1500: [103.45, 103.89, 104.23, 104.67, 105.01, 105.45],
      3000: [225.67, 226.34, 227.01, 228.45, 229.12, 230.45],
      5000: [380.12, 382.45, 384.78, 386.23, 388.56, 390.12],
      10000: [772.34, 776.89, 780.23, 785.67, 790.12, 795.45]
    }

    const skaters = [
      { name: 'Patrick Roest', country: 'NED' },
      { name: 'Nils van der Poel', country: 'SWE' },
      { name: 'Jorrit Bergsma', country: 'NED' },
      { name: 'Ted-Jan Bloemen', country: 'CAN' },
      { name: 'Graeme Fish', country: 'CAN' },
      { name: 'Davide Ghiotto', country: 'ITA' }
    ]

    const distanceTimes = times[distance] || times[1500]

    return {
      distance,
      standings: skaters.map((skater, index) => ({
        rank: index + 1,
        ...skater,
        time: distanceTimes[index],
        difference: index === 0 ? null : +(distanceTimes[index] - distanceTimes[0]).toFixed(2)
      }))
    }
  }

  getDemoPR(distance) {
    const prs = {
      500: 34.1 + Math.random() * 0.5,
      1000: 67.5 + Math.random() * 1.5,
      1500: 102.5 + Math.random() * 2,
      3000: 222 + Math.random() * 5,
      5000: 375 + Math.random() * 10,
      10000: 765 + Math.random() * 15
    }
    return Math.round((prs[distance] || 100) * 100) / 100
  }

  getDemoSB(distance) {
    const sbs = {
      500: 34.3 + Math.random() * 0.5,
      1000: 68 + Math.random() * 1.5,
      1500: 103 + Math.random() * 2,
      3000: 224 + Math.random() * 5,
      5000: 378 + Math.random() * 10,
      10000: 770 + Math.random() * 15
    }
    return Math.round((sbs[distance] || 102) * 100) / 100
  }
}
