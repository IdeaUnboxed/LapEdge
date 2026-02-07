// Event configuration for speed skating competitions
export const EventsConfig = {
  events: [
    {
      id: 'owg-milano-2026',
      name: 'Olympic Winter Games Milano Cortina 2026',
      location: 'Milano Speed Skating Stadium',
      country: 'ITA',
      startDate: '2026-02-06', // Event opens
      startTime: '16:00', // First event: 3000m Women on Feb 7
      endDate: '2026-02-22',
      timezone: 'Europe/Rome',
      source: 'isuresults',
      sourceUrl: 'https://live.isuresults.eu',
      isuEventId: '2026_ITA_0003', // ISU event identifier
      isOlympic: true
    },
    {
      id: 'wc-heerenveen-2026',
      name: 'World Cup Heerenveen',
      location: 'Thialf, Heerenveen',
      country: 'NED',
      startDate: '2026-01-17',
      startTime: '14:00',
      endDate: '2026-01-19',
      timezone: 'Europe/Amsterdam',
      source: 'isuresults',
      sourceUrl: 'https://live.isuresults.eu'
    },
    {
      id: 'wc-calgary-2026',
      name: 'World Cup Calgary',
      location: 'Olympic Oval, Calgary',
      country: 'CAN',
      startDate: '2026-01-24',
      startTime: '11:00',
      endDate: '2026-01-26',
      timezone: 'America/Edmonton',
      source: 'isuresults',
      sourceUrl: 'https://live.isuresults.eu'
    },
    {
      id: 'ek-allround-2026',
      name: 'EK Allround & Sprint',
      location: 'Thialf, Heerenveen',
      country: 'NED',
      startDate: '2026-01-10',
      startTime: '12:30',
      endDate: '2026-01-12',
      timezone: 'Europe/Amsterdam',
      source: 'isuresults',
      sourceUrl: 'https://live.isuresults.eu'
    },
    {
      id: 'nk-afstanden-2026',
      name: 'NK Afstanden',
      location: 'Thialf, Heerenveen',
      country: 'NED',
      startDate: '2025-12-26',
      startTime: '13:00',
      endDate: '2025-12-30',
      timezone: 'Europe/Amsterdam',
      source: 'schaatsen',
      sourceUrl: 'https://liveresults.schaatsen.nl'
    }
  ],

  distances: {
    sprint: [500, 1000],
    allround: [500, 1500, 3000, 5000, 10000],
    all: [500, 1000, 1500, 3000, 5000, 10000]
  },

  distanceConfig: {
    500: { laps: 1, innerStart: true, name: '500m' },
    1000: { laps: 2.5, innerStart: false, name: '1000m' },
    1500: { laps: 3.75, innerStart: true, name: '1500m' },
    3000: { laps: 7.5, innerStart: false, name: '3000m' },
    5000: { laps: 12.5, innerStart: true, name: '5000m' },
    10000: { laps: 25, innerStart: false, name: '10.000m' }
  },

  getActiveEvents() {
    const now = new Date()
    return this.events.filter(event => {
      const end = new Date(event.endDate)
      end.setDate(end.getDate() + 1)
      return end >= now
    })
  },

  getEvent(eventId) {
    return this.events.find(e => e.id === eventId)
  },

  getDistances(eventId) {
    const event = this.getEvent(eventId)
    if (!event) return this.distances.all

    if (event.name.toLowerCase().includes('sprint')) {
      return this.distances.sprint
    }
    if (event.name.toLowerCase().includes('allround')) {
      return this.distances.allround
    }
    return this.distances.all
  },

  getDistanceConfig(distance) {
    return this.distanceConfig[distance] || null
  }
}
