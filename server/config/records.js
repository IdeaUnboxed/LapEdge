// Distance records for speed skating
// WR = World Record, TR = Track Record (Thialf default), OR = Olympic Record
// Times in seconds

export const DistanceRecords = {
  // Men's records
  men: {
    500: {
      worldRecord: { time: 33.61, holder: 'Viktor Mushtakov', country: 'RUS', date: '2024-03-09', venue: 'Calgary' },
      olympicRecord: { time: 34.32, holder: 'Havard Lorentzen', country: 'NOR', date: '2018-02-19', venue: 'Pyeongchang' },
      trackRecords: {
        'thialf': { time: 34.00, holder: 'Pavel Kulizhnikov', country: 'RUS', date: '2020-02-16' },
        'calgary': { time: 33.61, holder: 'Viktor Mushtakov', country: 'RUS', date: '2024-03-09' },
        'salt-lake': { time: 33.98, holder: 'Jeremy Wotherspoon', country: 'CAN', date: '2007-11-09' },
        'inzell': { time: 34.15, holder: 'Pavel Kulizhnikov', country: 'RUS', date: '2019-02-08' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    1000: {
      worldRecord: { time: 65.36, holder: 'Pavel Kulizhnikov', country: 'RUS', date: '2020-02-15', venue: 'Salt Lake City' },
      olympicRecord: { time: 68.31, holder: 'Gerard van Velde', country: 'NED', date: '2002-02-16', venue: 'Salt Lake City' },
      trackRecords: {
        'thialf': { time: 67.68, holder: 'Kjeld Nuis', country: 'NED', date: '2023-12-10' },
        'calgary': { time: 66.09, holder: 'Pavel Kulizhnikov', country: 'RUS', date: '2019-12-08' },
        'salt-lake': { time: 65.36, holder: 'Pavel Kulizhnikov', country: 'RUS', date: '2020-02-15' },
        'inzell': { time: 67.56, holder: 'Kjeld Nuis', country: 'NED', date: '2019-02-09' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    1500: {
      worldRecord: { time: 100.07, holder: 'Jordan Stolz', country: 'USA', date: '2024-03-02', venue: 'Calgary' },
      olympicRecord: { time: 102.98, holder: 'Kjeld Nuis', country: 'NED', date: '2022-02-08', venue: 'Beijing' },
      trackRecords: {
        'thialf': { time: 102.32, holder: 'Thomas Krol', country: 'NED', date: '2024-12-14' },
        'calgary': { time: 100.07, holder: 'Jordan Stolz', country: 'USA', date: '2024-03-02' },
        'salt-lake': { time: 100.36, holder: 'Jordan Stolz', country: 'USA', date: '2024-02-03' },
        'inzell': { time: 102.89, holder: 'Kjeld Nuis', country: 'NED', date: '2019-02-10' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    3000: {
      worldRecord: { time: 216.64, holder: 'Nils van der Poel', country: 'SWE', date: '2022-02-06', venue: 'Beijing' },
      olympicRecord: { time: 216.64, holder: 'Nils van der Poel', country: 'SWE', date: '2022-02-06', venue: 'Beijing' },
      trackRecords: {
        'thialf': { time: 222.38, holder: 'Patrick Roest', country: 'NED', date: '2023-02-12' },
        'calgary': { time: 219.84, holder: 'Nils van der Poel', country: 'SWE', date: '2022-12-11' },
        'salt-lake': { time: 218.23, holder: 'Nils van der Poel', country: 'SWE', date: '2022-03-05' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    5000: {
      worldRecord: { time: 359.95, holder: 'Nils van der Poel', country: 'SWE', date: '2022-02-06', venue: 'Beijing' },
      olympicRecord: { time: 359.95, holder: 'Nils van der Poel', country: 'SWE', date: '2022-02-06', venue: 'Beijing' },
      trackRecords: {
        'thialf': { time: 367.83, holder: 'Patrick Roest', country: 'NED', date: '2023-02-12' },
        'calgary': { time: 362.82, holder: 'Nils van der Poel', country: 'SWE', date: '2022-12-11' },
        'salt-lake': { time: 360.62, holder: 'Nils van der Poel', country: 'SWE', date: '2022-03-06' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    10000: {
      worldRecord: { time: 745.36, holder: 'Nils van der Poel', country: 'SWE', date: '2022-02-11', venue: 'Beijing' },
      olympicRecord: { time: 745.36, holder: 'Nils van der Poel', country: 'SWE', date: '2022-02-11', venue: 'Beijing' },
      trackRecords: {
        'thialf': { time: 761.24, holder: 'Patrick Roest', country: 'NED', date: '2024-01-28' },
        'calgary': { time: 755.41, holder: 'Nils van der Poel', country: 'SWE', date: '2021-12-05' },
        'salt-lake': { time: 751.25, holder: 'Graeme Fish', country: 'CAN', date: '2020-02-14' },
        'milano': null // Nieuwe baan OWG 2026
      }
    }
  },

  // Women's records
  women: {
    500: {
      worldRecord: { time: 36.36, holder: 'Nao Kodaira', country: 'JPN', date: '2019-03-10', venue: 'Salt Lake City' },
      olympicRecord: { time: 36.94, holder: 'Nao Kodaira', country: 'JPN', date: '2018-02-18', venue: 'Pyeongchang' },
      trackRecords: {
        'thialf': { time: 36.67, holder: 'Nao Kodaira', country: 'JPN', date: '2019-02-16' },
        'calgary': { time: 36.53, holder: 'Nao Kodaira', country: 'JPN', date: '2019-12-07' },
        'salt-lake': { time: 36.36, holder: 'Nao Kodaira', country: 'JPN', date: '2019-03-10' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    1000: {
      worldRecord: { time: 71.57, holder: 'Brittany Bowe', country: 'USA', date: '2022-03-05', venue: 'Calgary' },
      olympicRecord: { time: 73.15, holder: 'Jorien ter Mors', country: 'NED', date: '2014-02-13', venue: 'Sochi' },
      trackRecords: {
        'thialf': { time: 72.46, holder: 'Jutta Leerdam', country: 'NED', date: '2024-12-14' },
        'calgary': { time: 71.57, holder: 'Brittany Bowe', country: 'USA', date: '2022-03-05' },
        'salt-lake': { time: 71.82, holder: 'Brittany Bowe', country: 'USA', date: '2020-02-14' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    1500: {
      worldRecord: { time: 108.65, holder: 'Miho Takagi', country: 'JPN', date: '2022-03-06', venue: 'Calgary' },
      olympicRecord: { time: 111.06, holder: 'Jorien ter Mors', country: 'NED', date: '2018-02-12', venue: 'Pyeongchang' },
      trackRecords: {
        'thialf': { time: 110.36, holder: 'Miho Takagi', country: 'JPN', date: '2023-12-09' },
        'calgary': { time: 108.65, holder: 'Miho Takagi', country: 'JPN', date: '2022-03-06' },
        'salt-lake': { time: 109.58, holder: 'Miho Takagi', country: 'JPN', date: '2022-02-05' },
        'milano': null // Nieuwe baan OWG 2026
      }
    },
    3000: {
      worldRecord: { time: 231.79, holder: 'Martina Sablikova', country: 'CZE', date: '2019-03-09', venue: 'Salt Lake City' },
      olympicRecord: { time: 233.13, holder: 'Ireen Wust', country: 'NED', date: '2014-02-09', venue: 'Sochi' },
      trackRecords: {
        'thialf': { time: 234.86, holder: 'Joy Beune', country: 'NED', date: '2024-02-10' },
        'calgary': { time: 232.64, holder: 'Martina Sablikova', country: 'CZE', date: '2019-12-08' },
        'salt-lake': { time: 231.79, holder: 'Martina Sablikova', country: 'CZE', date: '2019-03-09' },
        'milano': null // Nieuwe baan - record wordt gezet tijdens OWG 2026
      }
    },
    5000: {
      worldRecord: { time: 389.07, holder: 'Martina Sablikova', country: 'CZE', date: '2020-02-15', venue: 'Salt Lake City' },
      olympicRecord: { time: 392.34, holder: 'Esmee Visser', country: 'NED', date: '2018-02-16', venue: 'Pyeongchang' },
      trackRecords: {
        'thialf': { time: 394.62, holder: 'Joy Beune', country: 'NED', date: '2024-02-11' },
        'calgary': { time: 390.32, holder: 'Martina Sablikova', country: 'CZE', date: '2019-12-08' },
        'salt-lake': { time: 389.07, holder: 'Martina Sablikova', country: 'CZE', date: '2020-02-15' },
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
