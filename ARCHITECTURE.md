# LapEdge Architectuur

Dit document beschrijft de technische architectuur van LapEdge.

## Overzicht

LapEdge is een client-server applicatie die real-time schaatsdata aggregeert en presenteert.

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │           React App (Port 3000)                     │ │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────┐       │ │
│  │  │Components│  │  Hooks   │  │   Utils    │       │ │
│  │  └──────────┘  └──────────┘  └────────────┘       │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST
                         │
┌────────────────────────▼────────────────────────────────┐
│              Express Server (Port 3001)                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │                  API Routes                         │ │
│  └───────────┬───────────────────┬────────────────────┘ │
│              │                   │                       │
│  ┌───────────▼──────┐  ┌────────▼──────────┐           │
│  │  LiveData Service│  │  Records Service  │           │
│  │  (+ cache)       │  │  (+ cache)        │           │
│  └───────────┬──────┘  └────────┬──────────┘           │
│              │                   │                       │
│  ┌───────────▼──────┐  ┌────────▼──────────┐           │
│  │  ISU Adapter     │  │  Config/Records   │           │
│  │  Schaatsen.nl    │  │  Database         │           │
│  └──────────────────┘  └───────────────────┘           │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP Scraping
                         │
┌────────────────────────▼────────────────────────────────┐
│              External Data Sources                       │
│  • live.isuresults.eu  (live race data)                 │
│  • liveresults.schaatsen.nl  (backup data)              │
│  • speedskatingresults.com  (historical records)        │
└──────────────────────────────────────────────────────────┘
```

## Frontend Architectuur

### Technology Stack

- **React 18**: UI framework met hooks voor state management
- **Vite**: Build tool en development server
- **Chart.js + react-chartjs-2**: Canvas-based charting voor race grafieken

### Component Hierarchie

```
App.jsx
├── Header.jsx
├── Sidebar
│   ├── EventSelector.jsx
│   ├── DistanceSelector.jsx (met gender toggle)
│   └── StandingsPanel.jsx
└── Main Panel
    └── RaceView.jsx
        ├── Countdown.jsx (pre-race)
        ├── RecordTimesPanel.jsx (WR/OR/TR)
        ├── SkaterCard.jsx (per rijder)
        │   └── Lap data table
        └── RaceChart.jsx (tijdsverschillen grafiek)
```

### State Management

**Local State (useState):**
- Component-specific UI state
- Form inputs
- Toggle states

**Custom Hooks:**

1. **useLiveData** (`hooks/useLiveData.js`)
   - Polls live race data from API
   - Manages polling interval
   - Handles loading/error states
   - Returns: `{ raceData, standings, distanceRecords, loading, error }`

2. **useSettings** (`hooks/useSettings.js`)
   - Persists user settings to localStorage
   - Manages update interval
   - Manages gender preference
   - Returns: `{ settings, updateSettings }`

**Data Flow:**
```
User selects event/distance
         ↓
useLiveData hook triggers
         ↓
Polls API every N seconds
         ↓
Updates raceData state
         ↓
Components re-render
```

### Utilities

**calculations.js:**
- `calculateVirtualPosition()`: Bepaalt virtuele klassering
- `predictFinishTime()`: Voorspelt eindtijd o.b.v. huidige pace
- `calculateTimeDifference()`: Berekent tijdsverschillen
- `analyzePace()`: Analyseert rondetijd patronen

**timeFormat.js:**
- `formatTime(ms)`: Converteert milliseconds naar "mm:ss.dd"
- `parseTime(str)`: Parseert tijd string naar milliseconds
- `formatTimeDiff(ms)`: Formatteert tijdsverschil met +/-

## Backend Architectuur

### Technology Stack

- **Express.js**: Web framework voor API
- **Node-fetch**: HTTP client voor externe requests
- **Cheerio**: HTML parsing voor web scraping
- **In-memory caching**: Performance optimalisatie

### Layers

#### 1. API Layer (`server/index.js`)

Express routes die requests afhandelen en responses formatteren.

**Endpoints:**
- `/api/events` - Event lijst
- `/api/events/:eventId/distances` - Beschikbare afstanden
- `/api/live/:eventId/:distance` - Live race data
- `/api/standings/:eventId/:distance` - Klassement
- `/api/distance-records/:eventId/:distance` - WR/OR/TR
- `/api/records/:skaterId` - Rijder PR/SB
- `/api/refresh` - Cache clearing
- `/api/status` - System status

**Middleware:**
- CORS voor cross-origin requests
- JSON body parser
- Error handling

#### 2. Service Layer

**LiveDataService** (`services/liveData.js`)

Verantwoordelijk voor:
- Aggregeren van live race data
- Cache management (5 min TTL)
- Race detection en status bepaling
- Standings berekening

```javascript
class LiveDataService {
  constructor() {
    this.cache = new Map()
    this.isuAdapter = new ISUResultsAdapter()
  }

  async getRaceData(eventId, distance, gender) {
    // 1. Check cache
    // 2. Fetch from ISU adapter
    // 3. Process en normaliseer data
    // 4. Update cache
    // 5. Return data
  }
}
```

**RecordsService** (`services/records.js`)

Verantwoordelijk voor:
- Ophalen van persoonlijke records
- Caching van rijder data (1 dag TTL)
- Integratie met speedskatingresults.com

```javascript
class RecordsService {
  async getSkaterRecords(skaterId, distance) {
    // 1. Check cache
    // 2. Scrape speedskatingresults.com
    // 3. Parse PR en season best
    // 4. Cache result
    // 5. Return records
  }
}
```

#### 3. Adapter Layer

**ISUResultsAdapter** (`adapters/isuresults.js`)

Primaire data source voor live race data.

```javascript
class ISUResultsAdapter {
  async fetchLiveRace(eventUrl, distance, gender) {
    // 1. Fetch HTML van ISU Results
    // 2. Parse met Cheerio
    // 3. Extract race data (pairs, laps, times)
    // 4. Detect race status (waiting/live/ended)
    // 5. Return normalized data
  }

  parseLapTimes(html) {
    // Parse rondetijden table
    // Extract lap nummer, tijd, cumulatief
  }

  detectRaceStatus(html) {
    // Bepaal of race: not_started/waiting/live/ended
  }
}
```

**SchaatsenNLAdapter** (`adapters/schaatsenNL.js`)

Backup data source (momenteel niet actief gebruikt).

#### 4. Configuration Layer

**EventsConfig** (`config/events.js`)

Statische configuratie van wedstrijden:

```javascript
export const EventsConfig = {
  events: [
    {
      id: 'wcup-heerenveen-2025',
      name: 'World Cup Heerenveen',
      location: 'Heerenveen',
      startDate: '2025-02-07',
      isOlympic: false,
      isuUrl: 'https://live.isuresults.eu/...',
      distances: {
        men: [500, 1000, 1500, 5000, 10000],
        women: [500, 1000, 1500, 3000, 5000]
      }
    }
  ]
}
```

**DistanceRecords** (`config/records.js`)

Database van wereldrecords, Olympische records, en baanrecords:

```javascript
export const DistanceRecords = {
  worldRecords: {
    men: {
      500: { time: 33.61, holder: "...", date: "..." }
      // ... per afstand
    },
    women: { /* ... */ }
  },

  trackRecords: {
    'Heerenveen': { /* ... */ },
    'Salt Lake City': { /* ... */ }
  },

  olympicRecords: { /* ... */ }
}
```

### Caching Strategy

**LiveData Cache:**
- TTL: 5 minuten
- Key: `${eventId}:${distance}:${gender}`
- Invalidatie: automatisch na TTL of via `/api/refresh`
- Reden: Reduceer load op ISU servers, snellere response

**Records Cache:**
- TTL: 24 uur
- Key: `skater:${skaterId}:${distance}`
- Invalidatie: automatisch na TTL of via `/api/refresh`
- Reden: PR/SB wijzigen niet vaak, lange cache OK

**Cache Implementation:**
```javascript
class Cache {
  constructor(ttl = 300000) { // 5 min default
    this.cache = new Map()
    this.ttl = ttl
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl
    })
  }
}
```

## Data Flow

### Live Race Polling

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. Component mount
       │
┌──────▼──────────────────────────┐
│  useLiveData hook               │
│  - Start polling timer (3s)     │
└──────┬──────────────────────────┘
       │ 2. Every 3 seconds
       │
┌──────▼──────────────────────────┐
│  GET /api/live/:event/:distance │
└──────┬──────────────────────────┘
       │ 3. Check cache
       │
┌──────▼──────────────────────────┐
│  LiveDataService                │
│  - Cache hit? Return cached     │
│  - Cache miss? Fetch new        │
└──────┬──────────────────────────┘
       │ 4. Cache miss
       │
┌──────▼──────────────────────────┐
│  ISUResultsAdapter              │
│  - Fetch HTML from ISU          │
│  - Parse with Cheerio           │
│  - Extract race data            │
└──────┬──────────────────────────┘
       │ 5. Return normalized data
       │
┌──────▼──────────────────────────┐
│  LiveDataService                │
│  - Update cache                 │
│  - Return to API                │
└──────┬──────────────────────────┘
       │ 6. JSON response
       │
┌──────▼──────────────────────────┐
│  useLiveData hook               │
│  - Update state                 │
└──────┬──────────────────────────┘
       │ 7. State change triggers re-render
       │
┌──────▼──────────────────────────┐
│  Components re-render           │
│  - SkaterCard updates           │
│  - RaceChart updates            │
│  - StandingsPanel updates       │
└─────────────────────────────────┘
```

### Prediction Algorithm

Voor afstanden >1500m wordt eindtijd voorspeld:

```javascript
function predictFinishTime(laps, distance, pr) {
  const totalLaps = distance / 400 // 400m per ronde
  const completedLaps = laps.length

  if (completedLaps < 2) return null // Te vroeg

  // Methode 1: Gewogen gemiddelde (recente laps zwaarder)
  const weights = laps.map((_, i) => i + 1) // [1,2,3,4...]
  const weightedAvg = laps.reduce((sum, lap, i) =>
    sum + lap.time * weights[i], 0
  ) / weights.reduce((a, b) => a + b)

  const remainingLaps = totalLaps - completedLaps
  const predictedRemaining = weightedAvg * remainingLaps
  const currentCumulative = laps[laps.length - 1].cumulative

  const prediction = currentCumulative + predictedRemaining

  // Methode 2: Regressie tov PR schema (indien PR bekend)
  if (pr) {
    const prPace = pr / totalLaps
    const currentPace = currentCumulative / completedLaps
    const paceRatio = currentPace / prPace
    const prAdjusted = pr * paceRatio

    // Gemiddelde van beide methodes
    return (prediction + prAdjusted) / 2
  }

  return prediction
}
```

## Performance Overwegingen

### Frontend

1. **Memoization**: Gebruik `useMemo` voor dure berekeningen
2. **Callback Stability**: Gebruik `useCallback` voor event handlers
3. **Conditional Rendering**: Early returns voor loading states
4. **Chart Optimization**: Update chart alleen bij data wijziging

### Backend

1. **Caching**: Agressief cachen van external requests
2. **Connection Pooling**: Hergebruik HTTP connections
3. **Lazy Loading**: Laad events config alleen wanneer nodig
4. **Error Handling**: Graceful degradation bij external failures

### Network

1. **Polling Interval**: Configureerbaar (default 3s)
2. **Request Batching**: Meerdere distances in 1 request (toekomstig)
3. **Compression**: GZIP response compression
4. **CDN**: Statische assets via CDN (productie)

## Security Overwegingen

1. **No Authentication**: Publieke data, geen auth vereist
2. **CORS**: Configured voor development (localhost:3000)
3. **Rate Limiting**: TODO - bescherm tegen abuse
4. **Input Validation**: Valideer eventId, distance parameters
5. **Error Sanitization**: Geen sensitive data in error messages

## Deployment

### Development
```bash
npm run dev
# Frontend: localhost:3000
# Backend: localhost:3001
```

### Production
```bash
npm run build
# Statische bestanden in dist/
# Deploy frontend naar CDN/static hosting
# Deploy backend naar Node.js hosting (Railway, Render, etc.)
```

### Environment Variables

```bash
PORT=3001              # Backend port
UPDATE_INTERVAL=3      # Default polling interval (seconds)
LOG_LEVEL=info         # Logging niveau
```

## Toekomstige Verbeteringen

### Architectuur
- [ ] WebSocket voor real-time updates (ipv polling)
- [ ] Redis voor distributed caching
- [ ] GraphQL API als alternatief voor REST
- [ ] Service Worker voor offline support

### Features
- [ ] Multi-race simultaneous tracking
- [ ] Historical race replay
- [ ] Advanced prediction models (ML)
- [ ] Push notifications
- [ ] User accounts & favorites

### Performance
- [ ] Server-side rendering (SSR)
- [ ] Progressive Web App (PWA)
- [ ] Image optimization
- [ ] Lazy loading van componenten

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (Lighthouse CI)
- [ ] Analytics (privacy-friendly)
- [ ] Uptime monitoring

## Referenties

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Express Docs](https://expressjs.com)
- [Chart.js Docs](https://www.chartjs.org)
