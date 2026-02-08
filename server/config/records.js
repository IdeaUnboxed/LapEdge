// Distance records for speed skating
// WR = World Record, TR = Track Record (Thialf default), OR = Olympic Record
// Times in seconds

export const DistanceRecords = {
  // Men's records (updated Feb 2026)
  men: {
    500: {
      worldRecord: { time: 33.61, holder: 'Pavel Kulizhnikov', country: 'RUS', date: '2019-03-09', venue: 'Salt Lake City' },
      olympicRecord: { time: 34.32, holder: 'Gao Tingyu', country: 'CHN', date: '2022-02-12', venue: 'Beijing' },
      trackRecords: {
        'thialf': { time: 33.90, holder: 'Jordan Stolz', country: 'USA', date: '2025-12-07' },
        'calgary': { time: 33.70, holder: 'Jordan Stolz', country: 'USA', date: '2024-01-27' },
        'salt-lake': { time: 33.61, holder: 'Pavel Kulizhnikov', country: 'RUS', date: '2019-03-09' },
        'inzell': { time: 34.15, holder: 'Pavel Kulizhnikov', country: 'RUS', date: '2019-02-08' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    1000: {
      worldRecord: { time: 65.37, holder: 'Jordan Stolz', country: 'USA', date: '2024-01-26', venue: 'Salt Lake City' },
      olympicRecord: { time: 67.18, holder: 'Gerard van Velde', country: 'NED', date: '2002-02-16', venue: 'Salt Lake City' },
      trackRecords: {
        'thialf': { time: 67.68, holder: 'Kjeld Nuis', country: 'NED', date: '2023-12-10' },
        'calgary': { time: 66.09, holder: 'Pavel Kulizhnikov', country: 'RUS', date: '2019-12-08' },
        'salt-lake': { time: 65.37, holder: 'Jordan Stolz', country: 'USA', date: '2024-01-26' },
        'inzell': { time: 67.56, holder: 'Kjeld Nuis', country: 'NED', date: '2019-02-09' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    1500: {
      worldRecord: { time: 100.17, holder: 'Kjeld Nuis', country: 'NED', date: '2019-03-10', venue: 'Salt Lake City' },
      olympicRecord: { time: 103.21, holder: 'Kjeld Nuis', country: 'NED', date: '2022-02-08', venue: 'Beijing' },
      trackRecords: {
        'thialf': { time: 102.32, holder: 'Thomas Krol', country: 'NED', date: '2024-12-14' },
        'calgary': { time: 100.07, holder: 'Jordan Stolz', country: 'USA', date: '2024-03-02' },
        'salt-lake': { time: 100.17, holder: 'Kjeld Nuis', country: 'NED', date: '2019-03-10' },
        'inzell': { time: 102.89, holder: 'Kjeld Nuis', country: 'NED', date: '2019-02-10' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    3000: {
      worldRecord: { time: 212.52, holder: 'Metoděj Jílek', country: 'CZE', date: '2025-10-26', venue: 'Salt Lake City' },
      olympicRecord: { time: 216.64, holder: 'Nils van der Poel', country: 'SWE', date: '2022-02-06', venue: 'Beijing' },
      trackRecords: {
        'thialf': { time: 214.09, holder: 'Metoděj Jílek', country: 'CZE', date: '2025-09-16' },
        'calgary': { time: 219.84, holder: 'Nils van der Poel', country: 'SWE', date: '2022-12-11' },
        'salt-lake': { time: 212.52, holder: 'Metoděj Jílek', country: 'CZE', date: '2025-10-26' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    5000: {
      worldRecord: { time: 358.52, holder: 'Sander Eitrem', country: 'NOR', date: '2026-01-24', venue: 'Inzell' },
      olympicRecord: { time: 368.84, holder: 'Nils van der Poel', country: 'SWE', date: '2022-02-06', venue: 'Beijing' },
      trackRecords: {
        'thialf': { time: 367.83, holder: 'Patrick Roest', country: 'NED', date: '2023-02-12' },
        'calgary': { time: 362.82, holder: 'Nils van der Poel', country: 'SWE', date: '2022-12-11' },
        'salt-lake': { time: 360.23, holder: 'Timothy Loubineaud', country: 'FRA', date: '2025-11-14' },
        'inzell': { time: 358.52, holder: 'Sander Eitrem', country: 'NOR', date: '2026-01-24' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    10000: {
      worldRecord: { time: 745.69, holder: 'Davide Ghiotto', country: 'ITA', date: '2025-01-25', venue: 'Calgary' },
      olympicRecord: { time: 750.74, holder: 'Nils van der Poel', country: 'SWE', date: '2022-02-11', venue: 'Beijing' },
      trackRecords: {
        'thialf': { time: 761.24, holder: 'Patrick Roest', country: 'NED', date: '2024-01-28' },
        'calgary': { time: 745.69, holder: 'Davide Ghiotto', country: 'ITA', date: '2025-01-25' },
        'salt-lake': { time: 751.25, holder: 'Graeme Fish', country: 'CAN', date: '2020-02-14' },
        'inzell': { time: 746.30, holder: 'Davide Ghiotto', country: 'ITA', date: '2024-10-26' },
        'milano': null // Nieuwe baan OWG 2026
      }
    }
  },

  // Women's records (updated Feb 2026)
  women: {
    500: {
      worldRecord: { time: 36.09, holder: 'Femke Kok', country: 'NED', date: '2025-11-16', venue: 'Salt Lake City' },
      olympicRecord: { time: 36.94, holder: 'Nao Kodaira', country: 'JPN', date: '2018-02-18', venue: 'Pyeongchang' },
      trackRecords: {
        'thialf': { time: 36.67, holder: 'Nao Kodaira', country: 'JPN', date: '2019-02-16' },
        'calgary': { time: 36.53, holder: 'Nao Kodaira', country: 'JPN', date: '2019-12-07' },
        'salt-lake': { time: 36.09, holder: 'Femke Kok', country: 'NED', date: '2025-11-16' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    1000: {
      worldRecord: { time: 71.61, holder: 'Brittany Bowe', country: 'USA', date: '2019-03-09', venue: 'Salt Lake City' },
      olympicRecord: { time: 73.19, holder: 'Miho Takagi', country: 'JPN', date: '2022-02-17', venue: 'Beijing' },
      trackRecords: {
        'thialf': { time: 72.46, holder: 'Jutta Leerdam', country: 'NED', date: '2024-12-14' },
        'calgary': { time: 71.57, holder: 'Brittany Bowe', country: 'USA', date: '2022-03-05' },
        'salt-lake': { time: 71.61, holder: 'Brittany Bowe', country: 'USA', date: '2019-03-09' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    1500: {
      worldRecord: { time: 109.83, holder: 'Miho Takagi', country: 'JPN', date: '2019-03-10', venue: 'Salt Lake City' },
      olympicRecord: { time: 113.28, holder: 'Ireen Wüst', country: 'NED', date: '2022-02-07', venue: 'Beijing' },
      trackRecords: {
        'thialf': { time: 110.36, holder: 'Miho Takagi', country: 'JPN', date: '2023-12-09' },
        'calgary': { time: 108.65, holder: 'Miho Takagi', country: 'JPN', date: '2022-03-06' },
        'salt-lake': { time: 109.83, holder: 'Miho Takagi', country: 'JPN', date: '2019-03-10' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    3000: {
      worldRecord: { time: 232.02, holder: 'Martina Sáblíková', country: 'CZE', date: '2019-03-09', venue: 'Salt Lake City' },
      olympicRecord: { time: 236.93, holder: 'Irene Schouten', country: 'NED', date: '2022-02-05', venue: 'Beijing' },
      trackRecords: {
        'thialf': { time: 234.86, holder: 'Joy Beune', country: 'NED', date: '2024-02-10' },
        'calgary': { time: 232.64, holder: 'Martina Sáblíková', country: 'CZE', date: '2019-12-08' },
        'salt-lake': { time: 232.02, holder: 'Martina Sáblíková', country: 'CZE', date: '2019-03-09' },
        'milano': null // Nieuwe baan - record wordt gezet tijdens OWG 2026
      }
    },
    5000: {
      worldRecord: { time: 399.02, holder: 'Natalya Voronina', country: 'RUS', date: '2020-02-15', venue: 'Salt Lake City' },
      olympicRecord: { time: 403.51, holder: 'Irene Schouten', country: 'NED', date: '2022-02-10', venue: 'Beijing' },
      trackRecords: {
        'thialf': { time: 394.62, holder: 'Joy Beune', country: 'NED', date: '2024-02-11' },
        'calgary': { time: 390.32, holder: 'Martina Sáblíková', country: 'CZE', date: '2019-12-08' },
        'salt-lake': { time: 399.02, holder: 'Natalya Voronina', country: 'RUS', date: '2020-02-15' },
        'milano': null // Nieuwe baan - record wordt gezet tijdens OWG 2026
      }
    }
  },

  // Track ID mapping from event venue
  venueToTrackId: {
    'Thialf, Heerenveen': 'thialf',
    'Olympic Oval, Calgary': 'calgary',
    'Utah Olympic Oval': 'salt-lake',
    'Salt Lake City': 'salt-lake',
    'Max Aicher Arena, Inzell': 'inzell',
    'Inzell': 'inzell',
    'Milano Speed Skating Stadium': 'milano',
    'Milano Cortina': 'milano',
    'Milano': 'milano'
  },

  // Get records for a distance
  getDistanceRecords(distance, gender = 'men', venue = null) {
    const genderRecords = this[gender]
    if (!genderRecords || !genderRecords[distance]) {
      return null
    }

    const records = genderRecords[distance]
    const result = {
      worldRecord: records.worldRecord,
      olympicRecord: records.olympicRecord,
      trackRecord: null
    }

    // Find track record for venue
    if (venue) {
      const trackId = this.venueToTrackId[venue] || venue.toLowerCase().replace(/[^a-z]/g, '-')
      if (records.trackRecords && records.trackRecords[trackId]) {
        result.trackRecord = {
          ...records.trackRecords[trackId],
          venue: venue
        }
      }
    }

    return result
  },

  // Check if event is Olympic
  isOlympicEvent(eventName) {
    const olympicKeywords = ['olympic', 'olympische', 'olympics', 'winterspelen', 'OWG']
    return olympicKeywords.some(kw => 
      eventName.toLowerCase().includes(kw.toLowerCase())
    )
  }
}
