# LapEdge 🏃‍♂️

Second-screen webapp voor langebaan schaatsfans met live rondetijden, virtuele klassering, eindtijdvoorspellingen en race-analyse.

<img width="2505" height="1389" alt="image" src="https://github.com/user-attachments/assets/4b268cc7-1d9b-474a-a047-a67f3414b42e" />


## Over LapEdge

LapEdge is een webapp die schaatsfans realtime inzicht geeft in wedstrijden door:
- **Live rondetijden** - Zie elke ronde zodra deze gereden wordt
- **Virtuele klassering** - Vergelijk rijders die nog bezig zijn met al gefinishte ritten
- **Eindtijdvoorspellingen** - Geschatte eindtijd op basis van huidige pace (voor afstanden >1500m)
- **Referentievergelijkingen** - Vergelijk met wereldrecords, baanrecords, Olympische records, en persoonlijke records
- **Race-grafieken** - Visuele weergave van rondetijden en cumulatieve tijden
- **Gender-selectie** - Bekijk zowel mannen- als vrouwenwedstrijden
- **Countdown-timer** - Aftellen naar de start van een wedstrijd

Ideaal voor gebruik als tweede scherm naast een livestream of tv-uitzending.

## Hoofdfuncties

### Live Race Tracking
- Real-time rondetijden van ISU Results en Schaatsen.nl
- Automatische detectie van actieve races
- Ondersteuning voor alle gangbare afstanden (500m - 10000m)
- Status-weergave: "Nog niet gestart", "Live", "Afgelopen"

### Race-analyse
- **SkaterCard**: Gedetailleerde rijderinfo met rondetijden, cumulatieve tijden, en voorspellingen
- **RaceChart**: Grafische weergave van tijdsverschillen per ronde
- **RecordTimesPanel**: Overzicht van WR, OR (bij Olympische events), TR, en PR
- **StandingsPanel**: Live klassement met virtuele posities

### Intelligente Features
- **Eindtijdvoorspelling**: Machine learning-achtige voorspelling o.b.v. huidige pace
- **Pace-analyse**: Vergelijk rondetijden met referentieronden
- **Event-detectie**: Automatische detectie van Olympische events voor OR-weergave
- **Countdown**: Tot op de seconde aftellen naar de start

## Stack

- **Frontend**: React 18 + Vite + Chart.js + React Chart.js 2
- **Backend**: Express.js + Node.js
- **Data Sources**:
  - ISU Results (live.isuresults.eu) - Live race data
  - Schaatsen.nl (liveresults.schaatsen.nl) - Backup live data
  - World/Olympic/Track records database
- **Caching**: In-memory caching voor performance

## Installatie

### Vereisten
- Node.js 18+
- npm 8+

### Setup

```bash
# Clone de repository
git clone <repository-url>
cd lapedge

# Installeer dependencies
npm install

# (Optioneel) Environment configuratie
cp .env.example .env
```

## Development

```bash
# Start zowel frontend als backend (aanbevolen)
npm run dev

# Of draai ze apart:
npm run dev:client  # Vite dev server (poort 3000)
npm run dev:server  # Express API server (poort 3001)
```

**Applicatie URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

De ontwikkelomgeving ondersteunt:
- Hot Module Replacement (HMR) voor instant updates
- Auto-reload bij backend wijzigingen
- CORS voor cross-origin requests

## Productie Build

```bash
# Maak een productie build
npm run build

# Preview de productie build lokaal
npm run preview
```

De build wordt geplaatst in de `dist/` directory en is geoptimaliseerd voor productie.

## Wedstrijden toevoegen

Nieuwe wedstrijden voeg je toe in **`server/config/events.js`**, in de array `EventsConfig.events`. Elk event is een object met de volgende velden.

### Verplichte velden

| Veld        | Beschrijving |
|------------|---------------|
| `id`       | Unieke string (bijv. `wc-berlin-2026`), geen spaties |
| `name`     | Weergavenaam (bijv. "World Cup Berlin") |
| `location` | Locatie/baan (bijv. "Sportforum Hohenschönhausen, Berlin") |
| `country`  | Drielettercode (NED, GER, CAN, …) |
| `startDate`| Eerste dag, ISO-datum `YYYY-MM-DD` |
| `endDate`  | Laatste dag, ISO-datum `YYYY-MM-DD` |
| `source`   | Data-bron: `'isuresults'` of `'schaatsen'` |
| `sourceUrl`| Base-URL van de live-uitslagen |

### Bron: ISU Results (`source: 'isuresults'`)

- **`isuEventId`** (verplicht voor ISU): het event-ID zoals op [live.isuresults.eu](https://live.isuresults.eu).
  - Ga naar de wedstrijd op live.isuresults.eu.
  - Het ID staat in de URL: `https://live.isuresults.eu/events/2026_ITA_0003` → `isuEventId: '2026_ITA_0003'`.
- **`sourceUrl`**: zet op `'https://live.isuresults.eu'`.

Voorbeeld:

```js
{
  id: 'wc-berlin-2026',
  name: 'World Cup Berlin',
  location: 'Sportforum Hohenschönhausen, Berlin',
  country: 'GER',
  startDate: '2026-02-06',
  endDate: '2026-02-08',
  timezone: 'Europe/Berlin',
  source: 'isuresults',
  sourceUrl: 'https://live.isuresults.eu',
  isuEventId: '2026_GER_0001'   // uit de URL op live.isuresults.eu
}
```

### Bron: Schaatsen.nl (`source: 'schaatsen'`)

- **`sourceUrl`**: base-URL van de live-uitslagen, bijv. `'https://liveresults.schaatsen.nl'` (of een eventspecifieke URL als die wordt gebruikt).

Voorbeeld:

```js
{
  id: 'nk-afstanden-2026',
  name: 'NK Afstanden',
  location: 'Thialf, Heerenveen',
  country: 'NED',
  startDate: '2025-12-26',
  endDate: '2025-12-30',
  timezone: 'Europe/Amsterdam',
  source: 'schaatsen',
  sourceUrl: 'https://liveresults.schaatsen.nl'
}
```

### Optionele velden

| Veld         | Beschrijving |
|-------------|---------------|
| `startTime` | Starttijd eerste dag (bijv. `'14:00'`) voor countdown |
| `timezone`  | IANA timezone (bijv. `'Europe/Amsterdam'`) |
| `isOlympic` | `true` als het een Olympische wedstrijd is (toont OR in referentietijden) |

Na het toevoegen verschijnt de wedstrijd automatisch in de sidebar (als de einddatum nog niet verstreken is). Herstart de server niet per se; bij `npm run dev` wordt de config bij een volgende request gelezen.

## API Documentatie

### Events & Wedstrijden

#### `GET /api/events`
Haal alle beschikbare wedstrijden op: eerst de events uit de config, daarna komende evenementen van de [ISU API](https://api.isuresults.eu/events/) (huidige en volgende seizoen). De lijst wordt op startdatum gesorteerd. In de app kies je een wedstrijd via de dropdown.

**Response:**
```json
[
  {
    "id": "wcup-heerenveen-2025",
    "name": "World Cup Heerenveen",
    "location": "Heerenveen",
    "startDate": "2025-02-07",
    "endDate": "2025-02-09",
    "isOlympic": false
  }
]
```

#### `GET /api/events/:eventId/distances`
Haal beschikbare afstanden op voor een wedstrijd.

**Response:**
```json
{
  "men": [500, 1000, 1500, 5000, 10000],
  "women": [500, 1000, 1500, 3000, 5000]
}
```

### Live Data

#### `GET /api/live/:eventId/:distance?gender=men`
Haal live race data op voor een specifieke afstand.

**Query Parameters:**
- `gender` (optioneel): `men` of `women` (default: `women`)

**Response:**
```json
{
  "status": "live",
  "currentPair": 5,
  "skaters": [
    {
      "name": "Kjeld Nuis",
      "country": "NED",
      "laps": [
        { "lap": 1, "time": 25.12, "cumulative": 25.12 },
        { "lap": 2, "time": 24.98, "cumulative": 50.10 }
      ],
      "pr": 67.55,
      "seasonBest": 67.89,
      "prediction": 67.72
    }
  ]
}
```

#### `GET /api/standings/:eventId/:distance?gender=men`
Haal het huidige klassement op.

**Response:**
```json
[
  {
    "position": 1,
    "name": "Kjeld Nuis",
    "country": "NED",
    "time": 67.55,
    "diff": 0.00
  },
  {
    "position": 2,
    "name": "Laurent Dubreuil",
    "country": "CAN",
    "time": 67.89,
    "diff": 0.34
  }
]
```

### Records & Statistieken

#### `GET /api/distance-records/:eventId/:distance?gender=men`
Haal wereldrecords, baanrecords en Olympische records op.

**Query Parameters:**
- `gender` (optioneel): `men` of `women` (default: `men`)

**Response:**
```json
{
  "distance": 1000,
  "gender": "men",
  "venue": "Heerenveen",
  "isOlympicEvent": false,
  "worldRecord": {
    "time": 66.53,
    "holder": "Pavel Kulizhnikov",
    "date": "2020-02-09"
  },
  "trackRecord": {
    "time": 67.01,
    "holder": "Kjeld Nuis",
    "date": "2023-03-11"
  },
  "olympicRecord": null
}
```

#### `GET /api/records/:skaterId?distance=1000`
Haal persoonlijke records (PR) en seizoensbeste (SB) op voor een rijder.

**Query Parameters:**
- `distance` (optioneel): Specifieke afstand

**Response:**
```json
{
  "skaterId": "kjeld-nuis",
  "records": {
    "1000": {
      "pr": 67.55,
      "seasonBest": 67.89
    }
  }
}
```

#### `GET /api/skater/:skaterId`
Haal rijder informatie op inclusief alle records.

**Response:**
```json
{
  "id": "kjeld-nuis",
  "name": "Kjeld Nuis",
  "country": "NED",
  "records": {
    "500": { "pr": 34.32, "seasonBest": 34.55 },
    "1000": { "pr": 67.55, "seasonBest": 67.89 },
    "1500": { "pr": 103.67, "seasonBest": 104.12 }
  }
}
```

### Systeembeheer

#### `POST /api/refresh`
Ververs de cache voor live data en/of records.

**Body:**
```json
{
  "type": "records"  // of "live", of laat leeg voor beide
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared",
  "clearedAt": "2025-02-20T10:30:00.000Z"
}
```

#### `GET /api/status`
Haal systeem status op.

**Response:**
```json
{
  "recordsCacheSize": 42,
  "liveCacheSize": 8,
  "uptime": 3600,
  "timestamp": "2025-02-20T10:30:00.000Z"
}
```

## Project Structuur

```
lapedge/
├── server/
│   ├── adapters/           # Data source adapters
│   │   ├── isuresults.js   # ISU Results scraper
│   │   └── schaatsenNL.js  # Schaatsen.nl scraper
│   ├── config/
│   │   ├── events.js       # Wedstrijd configuratie
│   │   └── records.js      # WR/OR/TR database
│   ├── services/
│   │   ├── liveData.js     # Live data aggregatie
│   │   └── records.js      # Records ophalen & caching
│   └── index.js            # Express server + API routes
│
├── src/
│   ├── components/
│   │   ├── Countdown.jsx         # Countdown timer naar start
│   │   ├── DistanceSelector.jsx  # Afstandskiezer + gender toggle
│   │   ├── EventSelector.jsx     # Wedstrijdkiezer
│   │   ├── Header.jsx            # App header
│   │   ├── RaceChart.jsx         # Tijdsverschil grafiek
│   │   ├── RaceView.jsx          # Hoofd race view
│   │   ├── RecordTimesPanel.jsx  # WR/OR/TR referenties
│   │   ├── SettingsPanel.jsx     # Update interval settings
│   │   ├── SkaterCard.jsx        # Rijder details + rondetijden
│   │   └── StandingsPanel.jsx    # Klassement sidebar
│   ├── hooks/
│   │   ├── useLiveData.js        # Live data polling hook
│   │   └── useSettings.js        # Settings persistence hook
│   ├── utils/
│   │   ├── calculations.js       # Tijdsverschillen, voorspellingen
│   │   └── timeFormat.js         # Tijd formatting (mm:ss.dd)
│   ├── styles/
│   │   └── index.css             # Globale styling
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # App entry point
│
├── package.json
├── vite.config.js
├── prd.md                        # Product Requirements Document
└── README.md                     # Deze file
```

## Gebruikte Technologieën

### Frontend
- **React 18**: UI framework met hooks
- **Vite**: Snelle build tool en dev server
- **Chart.js**: Canvas-based charting
- **React-chartjs-2**: React wrapper voor Chart.js

### Backend
- **Express**: Web framework
- **Cheerio**: HTML parsing voor web scraping
- **Node-fetch**: HTTP requests naar data sources
- **CORS**: Cross-origin resource sharing

### Ontwikkeltools
- **Concurrently**: Parallel scripts draaien
- **@vitejs/plugin-react**: React support in Vite

## Roadmap

### v1.0 (Huidige versie) ✅
- [x] Live rondetijden van ISU Results
- [x] Virtuele klassering
- [x] Eindtijdvoorspellingen
- [x] WR/OR/TR referenties
- [x] Gender selectie
- [x] Race grafieken
- [x] Countdown timer
- [x] 1000m ondersteuning

### v1.1 (Gepland)
- [ ] Ondersteuning voor meerdere simultane races
- [ ] Historische race replay
- [ ] Verbeterde voorspellingsalgoritmes
- [ ] Push notificaties voor records
- [ ] Favoriet rijders tracking

### v1.2 (Toekomst)
- [ ] Persoonlijke instellingen opslaan
- [ ] CSV/JSON export van race data
- [ ] Multi-language support (EN/NL)
- [ ] Dark mode
- [ ] Mobile app (React Native)

## Bijdragen

Contributie is welkom! Open een issue of pull request.

### Development Guidelines
- Gebruik ESM modules (`import/export`)
- Volg bestaande code stijl
- Test nieuwe features grondig
- Update documentatie bij nieuwe features

## Licentie

MIT

## Data Sources Disclaimer

LapEdge gebruikt publiek beschikbare data van:
- **ISU Results** (live.isuresults.eu) - Live race data
- **Schaatsen.nl** (liveresults.schaatsen.nl) - Backup live data
- **Speedskatingresults.com** - Historische records

Dit is een **non-commercieel, fan-made project** voor persoonlijk gebruik. De applicatie respecteert de robots.txt en rate limits van deze platforms. Alle data blijft eigendom van de respectievelijke organisaties.

**Disclaimer:** LapEdge is niet geaffilieerd met ISU, Schaatsen.nl of andere schaatsorganisaties. Dit is een onafhankelijk project gemaakt door en voor schaatsfans.

## Credits

Gebouwd met ❤️ voor schaatsfans wereldwijd.

Data bronnen:
- ISU (International Skating Union)
- Schaatsen.nl
- Speedskatingresults.com
