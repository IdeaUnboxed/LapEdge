# Changelog

Alle belangrijke wijzigingen in dit project worden gedocumenteerd in dit bestand.

Het formaat is gebaseerd op [Keep a Changelog](https://keepachangelog.com/nl/1.0.0/),
en dit project volgt [Semantic Versioning](https://semver.org/lang/nl/).

## [1.2.0] - 2025-02-20

### Toegevoegd
- **Meerkamp (All-Around) Extensie - Fase 1**
  - Event type detectie (allround, sprint, distances)
  - Meerkamp afstanden configuratie in correcte volgorde per type
  - Samalog puntenberekening (p = tijd(s) / afstand(km))
  - Cumulatief meerkamp klassement over meerdere afstanden
  - MeerkampStandingsPanel component met live standings
  - Toggle tussen individuele afstand en meerkamp klassement
  - Tijdsdoel berekeningen per rijder (tijd nodig om #1 te worden)
  - Referentie-selectie (virtuele #1 of specifieke concurrent)
  - Kleurgecodeerde moeilijkheidsgraad voor tijdsdoelen
  - Weergave van gereden en resterende afstanden
  - API endpoints:
    - `GET /api/events/:eventId/meerkamp-distances`
    - `GET /api/meerkamp/:eventId/standings`
  - Historische standings ondersteuning (?afterDistance parameter)
  - DNF/DNS handling in meerkamp klassement

### Gewijzigd
- EventsConfig en isuEvents voegen nu eventType toe aan alle events
- App.jsx automatisch enable meerkamp modus voor allround/sprint events

### Technisch
- server/utils/samalog.js - Samalog berekeningen backend
- server/services/meerkampStandings.js - Tussenstand service
- src/utils/samalog.js - Samalog utilities frontend
- src/components/MeerkampStandingsPanel.jsx - Meerkamp UI
- Uitgebreide CSS styling voor meerkamp componenten

## [1.0.0] - 2025-02-20

### Toegevoegd
- 1000m afstand ondersteuning met chart en voorspelling
- Gender selectie voor mannen en vrouwen wedstrijden
- Competition-specifieke countdown timer tot start wedstrijd
- Reference Times Panel met WR/OR/TR weergave
- Automatische detectie van Olympische events voor OR-weergave
- Refresh functionaliteit voor cache clearing
- Race detection algoritme verbeteringen
- Voorspellingsalgoritme voor eindtijden (>1500m)

### Gewijzigd
- Verbeterde race detectie logica
- Geoptimaliseerde voorspellingsalgoritmes
- Bijgewerkte record database met laatste records
- Verbeterde foutafhandeling in data adapters

### Opgelost
- Race detection bugs bij overlappende ritten
- Voorspellingsfout bij onvolledige rondedata
- Cache invalidatie problemen

## [0.9.0] - 2025-02-09

### Toegevoegd
- RaceChart component voor visuele weergave tijdsverschillen
- RecordTimesPanel voor WR/TR referenties
- SettingsPanel voor configuratie van update interval
- SkaterCard met gedetailleerde rondetijden
- Countdown component voor pre-race timer
- DistanceSelector met gender toggle
- useLiveData hook voor automatische polling
- useSettings hook voor settings persistentie

### Gewijzigd
- Verbeterde UI/UX met moderne styling
- Responsief design voor mobile/tablet/desktop
- Betere error handling en loading states

## [0.5.0] - 2025-02-04

### Toegevoegd
- MVP release van LapEdge
- Live rondetijden van ISU Results
- Virtuele klassering
- Eindtijdvoorspellingen
- Event en afstand selectie
- API endpoints voor events, live data, standings, records
- Express backend met caching
- React frontend met Vite
- ISU Results adapter
- Schaatsen.nl adapter (backup)
- Records service met PR/SB tracking
- LiveData service voor race aggregatie

### Technisch
- React 18 + Vite setup
- Express.js API server
- Chart.js integratie
- Cheerio web scraping
- In-memory caching
- CORS ondersteuning

## [0.1.0] - 2025-02-02

### Toegevoegd
- Initiële project setup
- Repository structuur
- Package.json configuratie
- Git repository initialisatie
- PRD (Product Requirements Document)
- Basic README

---

## Versie Nummering

- **Major** (1.x.x): Breaking changes, grote nieuwe features
- **Minor** (x.1.x): Nieuwe features, backwards compatible
- **Patch** (x.x.1): Bug fixes, kleine verbeteringen

## Categorieën

- **Toegevoegd**: Nieuwe features
- **Gewijzigd**: Wijzigingen in bestaande functionaliteit
- **Verouderd**: Features die binnenkort verwijderd worden
- **Verwijderd**: Verwijderde features
- **Opgelost**: Bug fixes
- **Beveiliging**: Security fixes
