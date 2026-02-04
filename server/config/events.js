// Event configuration for speed skating competitions
export const EventsConfig = {
  events: [
    {
      id: 'owg-milano-2026',
      name: 'Olympic Winter Games Milano Cortina 2026',
      location: 'Milano Speed Skating Stadium',
      country: 'ITA',
      startDate: '2026-02-06',
      endDate: '2026-02-21',
      source: 'isuresults',
      sourceUrl: 'https://live.isuresults.eu',
      isOlympic: true
    },
    {
      id: 'wc-heerenveen-2024',
      name: 'World Cup Heerenveen',
      location: 'Thialf, Heerenveen',
      country: 'NED',
      startDate: '2024-12-13',
      endDate: '2024-12-15',
      source: 'isuresults',
      sourceUrl: 'https://live.isuresults.eu'
    },
    {
      id: 'wc-calgary-2024',
      name: 'World Cup Calgary',
      location: 'Olympic Oval, Calgary',
      country: 'CAN',
      startDate: '2024-12-06',
      endDate: '2024-12-08',
      source: 'isuresults',
      sourceUrl: 'https://live.isuresults.eu'
    },
    {
      id: 'nk-sprint-2024',
      name: 'NK Sprint',
      location: 'Thialf, Heerenveen',
      country: 'NED',
      startDate: '2024-12-21',
      endDate: '2024-12-22',
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
