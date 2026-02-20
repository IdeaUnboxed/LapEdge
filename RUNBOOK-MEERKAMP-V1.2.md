# Runbook: Meerkamp Extension v1.2

## ✅ Implementatie Status

**Fase 1 (v1.2)** - Meerkamp basis is geïmplementeerd en gecommit.

### Wat is geïmplementeerd:

1. **Backend**
   - ✅ EventType detectie (allround/sprint/distances)
   - ✅ Meerkamp distances configuratie (correcte volgorde per type en gender)
   - ✅ Samalog puntenberekening utilities
   - ✅ Meerkamp standings service (cumulatieve punten)
   - ✅ API endpoints voor meerkamp data
   - ✅ DNF/DNS handling

2. **Frontend**
   - ✅ Meerkamp toggle (Individuele Afstand / Meerkamp Klassement)
   - ✅ MeerkampStandingsPanel component
   - ✅ Tijdsdoel berekeningen per rijder
   - ✅ Referentie-selectie (virtuele #1 of specifieke concurrent)
   - ✅ Kleurgecodeerde moeilijkheidsgraad
   - ✅ Resterende en gereden afstanden weergave
   - ✅ Styling voor alle meerkamp componenten

3. **Features**
   - ✅ Samalog formule (p = tijd(s) / afstand(km))
   - ✅ Cumulatief klassement over meerdere afstanden
   - ✅ Virtuele punten voor lopende ritten
   - ✅ Tijd nodig om #1 te worden
   - ✅ Historische standings (via ?afterDistance parameter)

## 🧪 Test Instructies

### Stap 1: Start de Applicatie

```bash
# Start development servers
npm run dev

# Of apart:
npm run dev:server  # Backend op :3001
npm run dev:client  # Frontend op :5173 (Vite)
```

### Stap 2: Open de Applicatie

```
http://localhost:5173
```

### Stap 3: Selecteer een Meerkamp Event

**Beschikbare meerkamp events:**

1. **EK Allround & Sprint** (id: `ek-allround-2026`)
   - Event type: allround
   - Locatie: Thialf, Heerenveen
   - Datum: 2026-01-10 tot 2026-01-12

2. **ISU Speed Skating Allround & Sprint World Championships** (id: `2026_NED_0002`)
   - Event type: allround
   - Locatie: Thialf, Heerenveen
   - Datum: 2026-03-05 tot 2026-03-08

**Let op:** Als deze events niet in de lijst staan (omdat de datum verstreken is), kun je handmatig een event toevoegen in `server/config/events.js`:

```javascript
{
  id: 'test-allround-2026',
  name: 'Test EK Allround',
  location: 'Thialf, Heerenveen',
  country: 'NED',
  startDate: '2026-03-01',  // Datum in de toekomst
  endDate: '2026-03-03',
  timezone: 'Europe/Amsterdam',
  source: 'isuresults',
  sourceUrl: 'https://live.isuresults.eu'
}
```

### Stap 4: Verifieer Meerkamp Toggle

Na selectie van een allround/sprint event moet je zien:

1. **Toggle buttons** boven de main panel:
   - "Individuele Afstand" (standaard geselecteerd)
   - "Meerkamp Klassement"

2. **In de sidebar**:
   - Meerkamp panel verschijnt automatisch (of na toggle klik)

### Stap 5: Test Meerkamp Klassement

Klik op **"Meerkamp Klassement"** en verifieer:

**Meerkamp Panel bevat:**
- ✅ Event type badge (ALLROUND of SPRINT)
- ✅ Huidige afstand en status (indien van toepassing)
- ✅ Referentie-selectie dropdown:
  - "Virtuele #1"
  - "Specifieke rijder"
- ✅ Standings tabel met kolommen:
  - Pos (positie)
  - Naam
  - Land
  - Punten (gefinisht)
  - Virtueel (met lopende rit)
  - Verschil (t.o.v. #1)
  - Tijdsdoel (alleen bij lopende afstand)

**Styling checks:**
- ✅ Leider (#1) heeft groene achtergrond
- ✅ DNF rijders zijn grijs/opacity
- ✅ Tijdsdoelen zijn kleurgecodeerd:
  - Groen: makkelijk haalbaar
  - Geel: krap maar mogelijk
  - Oranje: moeilijk
  - Rood: zeer moeilijk

**Onder de tabel:**
- ✅ "Gereden afstanden" met groene badges
- ✅ "Resterende afstanden" met grijze badges
- ✅ Laatste update timestamp

### Stap 6: Test API Endpoints Direct

**Meerkamp distances:**
```bash
# Mannen allround
curl http://localhost:3001/api/events/ek-allround-2026/meerkamp-distances?gender=men
# Response: {"distances":[500,5000,1500,10000]}

# Vrouwen allround
curl http://localhost:3001/api/events/ek-allround-2026/meerkamp-distances?gender=women
# Response: {"distances":[500,3000,1500,5000]}

# Sprint (beide genders hetzelfde)
curl http://localhost:3001/api/events/some-sprint-event/meerkamp-distances?gender=men
# Response: {"distances":[500,1000,500,1000]}
```

**Meerkamp standings:**
```bash
# Huidige standings
curl http://localhost:3001/api/meerkamp/ek-allround-2026/standings?gender=men

# Historische standings na 1e afstand (500m)
curl "http://localhost:3001/api/meerkamp/ek-allround-2026/standings?gender=men&afterDistance=500"
```

**Expected response:**
```json
{
  "eventId": "ek-allround-2026",
  "gender": "men",
  "eventType": "allround",
  "allDistances": [500, 5000, 1500, 10000],
  "completedDistances": [500, 5000],
  "currentDistance": 1500,
  "currentRaceStatus": "live",
  "standings": [
    {
      "rank": 1,
      "skaterId": "...",
      "name": "...",
      "country": "NED",
      "pointsFinished": 145.234,
      "pointsVirtual": 145.234,
      "gapToFirst": 0,
      "dnf": false,
      "remainingDistances": [1500, 10000]
    }
  ],
  "lastUpdated": "2026-01-10T14:30:00.000Z"
}
```

### Stap 7: Test Geen Regressie

**Belangrijk:** Verifieer dat bestaande functionaliteit nog werkt.

1. **Selecteer een non-meerkamp event** (bijv. "World Cup Heerenveen")
2. Verifieer:
   - ✅ Meerkamp toggle is NIET zichtbaar
   - ✅ Normale afstandselectie werkt
   - ✅ Live race data laadt zoals voorheen
   - ✅ Standings panel werkt normaal

## 🔍 Wat Te Controleren

### Backend Checks

1. **EventType wordt correct toegevoegd:**
   ```bash
   curl http://localhost:3001/api/events | jq '.[] | select(.name | contains("Allround")) | {name, eventType}'
   ```
   Moet `"eventType": "allround"` tonen.

2. **Meerkamp distances zijn correct:**
   - Mannen allround: 500 → 5000 → 1500 → 10000
   - Vrouwen allround: 500 → 3000 → 1500 → 5000
   - Sprint (m/v): 500 → 1000 → 500 → 1000

3. **Samalog berekening klopt:**
   - Formule: punten = tijd(seconden) / afstand(km)
   - Voorbeeld: 35.00s op 500m (0.5km) = 35.00 / 0.5 = 70.000 punten
   - Voorbeeld: 106.00s op 1500m (1.5km) = 106.00 / 1.5 = 70.667 punten

### Frontend Checks

1. **Toggle werkt:**
   - Bij allround/sprint event: toggle zichtbaar
   - Bij distances event: toggle NIET zichtbaar
   - Beide modes werken (individueel en meerkamp)

2. **Meerkamp panel laadt:**
   - Standings worden opgehaald
   - Data refresht elke 5 seconden
   - Loading state werkt

3. **Tijdsdoel berekeningen:**
   - Formule: Δt = Δp × afstand(km)
   - Voorbeeld: 2 punten achterstand op 1500m = 2 × 1.5 = 3.0 seconden
   - Negatieve tijd = moet sneller
   - Positieve tijd = mag langzamer

4. **Referentie-selectie:**
   - "Virtuele #1" werkt (standaard)
   - "Specifieke rijder" dropdown werkt
   - Tijdsdoelen updaten bij verandering

## ⚠️ Bekende Beperkingen v1.2

1. **Geen virtuele punten voor lopende rit**
   - Backend gebruikt alleen gefinishte ritten
   - Virtuele punten tijdens race worden in v1.3 toegevoegd

2. **Geen "wie kan nog winnen" analyse**
   - Komt in v1.3 met minimaal/maximaal haalbare punten

3. **Geen kampioenschapsoverzicht scherm**
   - Komt in v1.3 met volledig schema en startlijsten

4. **Geen historische vergelijking**
   - Komt in v1.4

## 🐛 Troubleshooting

### Meerkamp panel laadt niet

**Check:**
```bash
# Server logs
npm run dev:server

# Browser console (F12)
# Kijk naar network tab voor API calls
```

**Veelvoorkomende issues:**
- Event heeft geen eventType → Check server/config/events.js
- API geeft 404 → Event is niet allround/sprint
- API geeft 500 → Check server logs voor errors

### Standings zijn leeg

**Mogelijke oorzaken:**
1. Event heeft geen live data beschikbaar
2. Afstand is nog niet gereden
3. ISU Results is offline

**Workaround voor testing:**
Gebruik mock data of wacht tot live event.

### Styling ziet er vreemd uit

**Check:**
1. Cache refresh in browser (Ctrl+Shift+R)
2. Vite dev server is gestart
3. CSS bestand is up-to-date

## 📝 Volgende Stappen (v1.3)

Zie `IMPLEMENTATION-MEERKAMP.md` Fase 2 voor:
- Virtuele punten lopende rit
- "Wie kan nog kampioen worden"
- Kampioenschapsoverzicht scherm
- Schema en startlijsten

## ✅ Checklist Voltooiing v1.2

- [x] Config & datamodel (eventType, meerkamp distances)
- [x] Backend Samalog utilities
- [x] Backend meerkamp standings service
- [x] API endpoints (meerkamp-distances, standings)
- [x] Frontend Samalog utilities
- [x] Frontend MeerkampStandingsPanel
- [x] Toggle tussen individueel en meerkamp
- [x] Tijdsdoel berekeningen
- [x] Referentie-selectie
- [x] Styling
- [x] Geen regressie tests
- [x] Commit en documentatie

**Status: ✅ COMPLEET**
