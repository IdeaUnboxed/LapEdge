import fetch from 'node-fetch'

/**
 * ISU Results API Adapter
 * Uses the official api.isuresults.eu API
 */
export class ISUResultsAdapter {
  constructor() {
    this.apiBase = 'https://api.isuresults.eu'
    this.competitionsCache = new Map()
    this.competitionsCacheTime = 60000 // 1 minute cache for competitions list
  }

  async getCompetitions(eventId) {
    const cacheKey = `competitions-${eventId}`
    const cached = this.competitionsCache.get(cacheKey)
    if (cached && Date.now() - cached.time < this.competitionsCacheTime) {
      return cached.data
    }

    const url = `${this.apiBase}/events/${eventId}/competitions/`
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      timeout: 10000
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch competitions: ${response.status}`)
    }

    const data = await response.json()
    this.competitionsCache.set(cacheKey, { data, time: Date.now() })
    return data
  }

  findCompetition(competitions, distance, gender = 'F') {
    // Find matching competition by distance and gender
    const genderCode = gender === 'women' || gender === 'F' ? 'F' : 'M'
    
    return competitions.find(comp => {
      const matchesDistance = comp.distance?.distance === distance
      const matchesGender = comp.category === genderCode
      return matchesDistance && matchesGender
    })
  }

  async fetchRaceData(event, distance, gender = 'women') {
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

    const eventId = event.isuEventId
    if (!eventId) {
      return this.getWaitingData(event, distance)
    }

    try {
      // Get competitions list
      const competitions = await this.getCompetitions(eventId)
      
      // Find the right competition for this distance and gender
      const genderCode = gender === 'men' || gender === 'M' ? 'M' : 'F'
      const competition = this.findCompetition(competitions, distance, genderCode)
      
      if (!competition) {
        console.log(`[ISU API] No competition found for ${distance}m`)
        return this.getWaitingData(event, distance)
      }

      console.log(`[ISU API] Found: ${competition.title} (isLive: ${competition.isLive})`)

      // Check if competition hasn't started yet
      const competitionStart = new Date(competition.start)
      const now = new Date()
      
      if (now < competitionStart) {
        console.log(`[ISU API] Competition starts at: ${competition.start}`)
        return this.getNotStartedCompetitionData(event, distance, competition)
      }

      // Fetch results
      const resultsUrl = competition.resultsUrl
      const response = await fetch(resultsUrl, {
        headers: { 'Accept': 'application/json' },
        timeout: 10000
      })

      if (!response.ok) {
        console.log(`[ISU API] Results returned ${response.status}`)
        return this.getWaitingData(event, distance, competition)
      }

      const results = await response.json()
      
      if (!results || results.length === 0) {
        return this.getWaitingData(event, distance, competition)
      }

      // Fetch personal bests
      let personalBests = new Map()
      if (competition.personalBestsUrl) {
        try {
          const pbResponse = await fetch(competition.personalBestsUrl, {
            headers: { 'Accept': 'application/json' },
            timeout: 5000
          })
          if (pbResponse.ok) {
            const pbData = await pbResponse.json()
            pbData.forEach(pb => {
              personalBests.set(pb.skaterId, this.parseTime(pb.time))
            })
            console.log(`[ISU API] Loaded ${personalBests.size} personal bests`)
          }
        } catch (e) {
          console.log(`[ISU API] Could not load personal bests: ${e.message}`)
        }
      }

      return this.transformResults(results, distance, competition, personalBests)

    } catch (error) {
      console.log(`[ISU API] Error: ${error.message}`)
      return this.getWaitingData(event, distance)
    }
  }

  transformResults(results, distance, competition, personalBests = new Map()) {
    // Get the most recent racing pair (last 2 skaters that started)
    // Results are ordered by rank, so find those still racing or most recent
    const sortedByStart = [...results].sort((a, b) => b.startNumber - a.startNumber)
    
    // Get the last pair (highest start numbers)
    const lastPair = sortedByStart.slice(0, 2)
    const pairNumber = Math.ceil(sortedByStart[0]?.startNumber / 2) || 1

    // Get leader data (rank 1) for comparison
    const leaderResult = results.find(r => r.rank === 1)
    const leaderPassageTimes = leaderResult?.laps?.map(lap => this.parsePassageTime(lap.passageTime)) || []

    const skaters = lastPair.map(result => {
      const skater = result.competitor?.skater || {}
      const laps = result.laps || []
      const skaterId = skater.id || result.id
      
      // Get PR from personal bests map
      const pr = personalBests.get(skaterId) || null
      
      return {
        id: skaterId,
        name: `${skater.firstName || ''} ${skater.lastName || ''}`.trim() || 'Unknown',
        country: skater.country || 'UNK',
        photo: skater.photo,
        lane: result.startLane === 'I' ? 'inner' : 'outer',
        armband: result.armband,
        lapTimes: laps.map(lap => parseFloat(lap.time)),
        passageTimes: laps.map(lap => this.parsePassageTime(lap.passageTime)),
        lapRanks: laps.map(lap => lap.rank),
        finalTime: result.time ? this.parseTime(result.time) : null,
        rank: result.rank,
        timeBehind: result.timeBehind ? parseFloat(result.timeBehind) : null,
        pr: pr,
        seasonBest: null // ISU API doesn't seem to provide season bests separately
      }
    })

    console.log(`[ISU API] Pair ${pairNumber}: ${skaters.map(s => s.name).join(' vs ')}`)

    // Get leader info for display
    const leaderSkater = leaderResult?.competitor?.skater || {}
    const leader = leaderResult ? {
      name: `${leaderSkater.firstName || ''} ${leaderSkater.lastName || ''}`.trim(),
      country: leaderSkater.country || 'UNK',
      time: this.parseTime(leaderResult.time),
      passageTimes: leaderPassageTimes
    } : null

    // Get top 3 with passage times for chart comparison
    const top3 = results
      .filter(r => r.rank && r.rank <= 3 && r.laps?.length > 0)
      .sort((a, b) => a.rank - b.rank)
      .map(result => {
        const sk = result.competitor?.skater || {}
        return {
          rank: result.rank,
          name: `${sk.firstName || ''} ${sk.lastName || ''}`.trim(),
          country: sk.country || 'UNK',
          time: this.parseTime(result.time),
          passageTimes: result.laps?.map(lap => this.parsePassageTime(lap.passageTime)) || [],
          lapTimes: result.laps?.map(lap => parseFloat(lap.time)) || []
        }
      })

    return {
      status: competition.isLive ? 'racing' : 'finished',
      currentRace: {
        pairNumber: pairNumber,
        status: competition.isLive ? 'in_progress' : 'finished',
        distance: distance,
        title: competition.title,
        skaters: skaters,
        leader: leader,
        top3: top3  // Include top 3 with passage times for chart
      },
      totalResults: results.length
    }
  }

  parseTime(timeStr) {
    if (typeof timeStr === 'number') return timeStr
    if (!timeStr) return null
    
    // Handle "3:54.280" format
    if (timeStr.includes(':')) {
      const [min, sec] = timeStr.split(':')
      return parseFloat(min) * 60 + parseFloat(sec)
    }
    return parseFloat(timeStr)
  }

  parsePassageTime(timeStr) {
    return this.parseTime(timeStr)
  }

  async fetchStandings(event, distance, gender = 'women') {
    const eventId = event.isuEventId
    if (!eventId) {
      return { distance, standings: [] }
    }

    try {
      const competitions = await this.getCompetitions(eventId)
      const genderCode = gender === 'men' || gender === 'M' ? 'M' : 'F'
      const competition = this.findCompetition(competitions, distance, genderCode)
      
      if (!competition) {
        return { distance, standings: [] }
      }

      const response = await fetch(competition.resultsUrl, {
        headers: { 'Accept': 'application/json' },
        timeout: 10000
      })

      if (!response.ok) {
        return { distance, standings: [] }
      }

      const results = await response.json()
      
      // Sort by rank and return top standings
      const standings = results
        .filter(r => r.rank && r.time)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 20)
        .map(r => ({
          rank: r.rank,
          name: `${r.competitor?.skater?.firstName || ''} ${r.competitor?.skater?.lastName || ''}`.trim(),
          country: r.competitor?.skater?.country || 'UNK',
          photo: r.competitor?.skater?.photo,
          time: this.parseTime(r.time),
          timeFormatted: r.time,
          timeBehind: r.timeBehind ? parseFloat(r.timeBehind) : null
        }))

      return { distance, standings }

    } catch (error) {
      console.log(`[ISU API] Standings error: ${error.message}`)
      return { distance, standings: [] }
    }
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

  getWaitingData(event, distance, competition = null) {
    return {
      status: 'waiting',
      message: competition 
        ? `Wachten op ${competition.title} data...`
        : 'Wachten op live data...',
      isuUrl: event.isuEventId 
        ? `https://live.isuresults.eu/events/${event.isuEventId}`
        : null,
      currentRace: null
    }
  }

  getNotStartedCompetitionData(event, distance, competition) {
    const startDateTime = new Date(competition.start)
    
    // Format time in local timezone of the event
    const timeOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: event.timezone || 'Europe/Rome'
    }
    const startTimeStr = startDateTime.toLocaleTimeString('nl-NL', timeOptions)
    
    const dateOptions = {
      weekday: 'long',
      day: 'numeric', 
      month: 'long',
      timeZone: event.timezone || 'Europe/Rome'
    }
    const startDateStr = startDateTime.toLocaleDateString('nl-NL', dateOptions)

    return {
      status: 'not_started',
      message: `${competition.title} begint op ${startDateStr}`,
      event: {
        name: event.name,
        location: event.location,
        startDate: event.startDate,
        startTime: startTimeStr,
        startDateTime: startDateTime.toISOString(),
        endDate: event.endDate,
        timezone: event.timezone || 'Europe/Rome'
      },
      competition: {
        title: competition.title,
        distance: distance,
        startDateTime: competition.start
      },
      isuUrl: `https://live.isuresults.eu/events/${event.isuEventId}`,
      currentRace: null
    }
  }
}
