import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

export class SchaatsenNLAdapter {
  constructor() {
    this.baseUrl = 'https://liveresults.schaatsen.nl'
  }

  async fetchRaceData(event, distance) {
    const now = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)
    endDate.setDate(endDate.getDate() + 1)

    if (now < startDate) {
      return this.getNotStartedData(event, distance)
    }

    if (now > endDate) {
      return this.getEndedData(event, distance)
    }

    try {
      const url = `${event.sourceUrl}/api/race/${distance}`
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LapEdge/1.0 (Personal use)'
        },
        timeout: 5000
      })

      if (response.ok) {
        const data = await response.json()
        return this.transformData(data)
      }
    } catch (error) {
      console.log('No live data available for Schaatsen.nl')
    }

    return this.getWaitingData(event, distance)
  }

  async fetchStandings(event, distance) {
    const now = new Date()
    const startDate = new Date(event.startDate)

    if (now < startDate) {
      return { distance, standings: [] }
    }

    try {
      const url = `${event.sourceUrl}/api/standings/${distance}`
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
      console.log('No standings available for Schaatsen.nl')
    }

    return { distance, standings: [] }
  }

  getNotStartedData(event, distance) {
    const startDate = new Date(event.startDate)
    const startDateTime = event.startTime 
      ? new Date(`${event.startDate}T${event.startTime}:00`)
      : startDate
    
    return {
      status: 'not_started',
      message: `${event.name} begint op ${startDate.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}`,
      event: {
        name: event.name,
        location: event.location,
        startDate: event.startDate,
        startTime: event.startTime || '12:00',
        startDateTime: startDateTime.toISOString(),
        endDate: event.endDate,
        timezone: event.timezone || 'Europe/Amsterdam'
      },
      currentRace: null
    }
  }

  getEndedData(event, distance) {
    return {
      status: 'ended',
      message: `${event.name} is afgelopen`,
      event: {
        name: event.name,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate
      },
      currentRace: null
    }
  }

  getWaitingData(event, distance) {
    return {
      status: 'waiting',
      message: 'Wachten op volgende rit...',
      currentRace: null
    }
  }

  transformData(rawData) {
    // Transform schaatsen.nl format to normalized format
    return {
      status: rawData.status || 'racing',
      currentRace: {
        pairNumber: rawData.rit || 1,
        status: rawData.status || 'in_progress',
        distance: rawData.afstand,
        skaters: (rawData.rijders || []).map(rijder => ({
          id: rijder.id || rijder.naam,
          name: rijder.naam,
          country: rijder.land || 'NED',
          lane: rijder.baan === 'binnen' ? 'inner' : 'outer',
          lapTimes: rijder.rondetijden || [],
          pr: rijder.pr,
          seasonBest: rijder.sb
        }))
      }
    }
  }

  getDemoRaceData(distance) {
    // Dutch skaters for NK events
    const dutchSkaters = [
      { name: 'Kjeld Nuis', country: 'NED' },
      { name: 'Thomas Krol', country: 'NED' },
      { name: 'Kai Verbij', country: 'NED' },
      { name: 'Hein Otterspeer', country: 'NED' }
    ]

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

    const generateLapTimes = (basePace, count) => {
      const times = []
      for (let i = 0; i < count; i++) {
        times.push(Math.round((basePace + (Math.random() - 0.5) * 1.5) * 1000) / 1000)
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

    const skater1 = dutchSkaters[Math.floor(Math.random() * dutchSkaters.length)]
    let skater2 = dutchSkaters[Math.floor(Math.random() * dutchSkaters.length)]
    while (skater2.name === skater1.name) {
      skater2 = dutchSkaters[Math.floor(Math.random() * dutchSkaters.length)]
    }

    return {
      status: 'racing',
      currentRace: {
        pairNumber: Math.floor(Math.random() * 10) + 1,
        status: 'in_progress',
        distance: distance,
        skaters: [
          {
            id: 'demo-nl-1',
            ...skater1,
            lane: 'inner',
            lapTimes: generateLapTimes(basePaces[distance] || 28, currentLap),
            pr: this.getDemoPR(distance),
            seasonBest: this.getDemoSB(distance)
          },
          {
            id: 'demo-nl-2',
            ...skater2,
            lane: 'outer',
            lapTimes: generateLapTimes(basePaces[distance] || 28, currentLap),
            pr: this.getDemoPR(distance),
            seasonBest: this.getDemoSB(distance)
          }
        ]
      }
    }
  }

  getDemoStandings(distance) {
    const times = {
      500: [34.52, 34.65, 34.78, 34.91, 35.09, 35.22],
      1000: [68.65, 68.98, 69.21, 69.44, 69.76, 70.09],
      1500: [103.65, 104.09, 104.43, 104.87, 105.21, 105.65],
      3000: [226.87, 227.54, 228.21, 229.65, 230.32, 231.65],
      5000: [381.32, 383.65, 385.98, 387.43, 389.76, 391.32],
      10000: [774.54, 779.09, 782.43, 787.87, 792.32, 797.65]
    }

    const skaters = [
      { name: 'Kjeld Nuis', country: 'NED' },
      { name: 'Thomas Krol', country: 'NED' },
      { name: 'Kai Verbij', country: 'NED' },
      { name: 'Hein Otterspeer', country: 'NED' },
      { name: 'Merijn Scheperkamp', country: 'NED' },
      { name: 'Stefan Westenbroek', country: 'NED' }
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
      500: 34.2 + Math.random() * 0.5,
      1000: 67.6 + Math.random() * 1.5,
      1500: 102.6 + Math.random() * 2,
      3000: 222.5 + Math.random() * 5,
      5000: 376 + Math.random() * 10,
      10000: 766 + Math.random() * 15
    }
    return Math.round((prs[distance] || 100) * 100) / 100
  }

  getDemoSB(distance) {
    const sbs = {
      500: 34.4 + Math.random() * 0.5,
      1000: 68.1 + Math.random() * 1.5,
      1500: 103.1 + Math.random() * 2,
      3000: 224.5 + Math.random() * 5,
      5000: 379 + Math.random() * 10,
      10000: 771 + Math.random() * 15
    }
    return Math.round((sbs[distance] || 102) * 100) / 100
  }
}
