# PRD-addendum: Meerkamp (Allround & Sprint)

**Relatie met hoofd-PRD:** Dit document is een addendum op [prd.md](prd.md) en specificeert de functionele en technische eisen voor meerkampkampioenschappen (Allround en Sprint). Het hoofd-PRD (secties 1–8) blijft gelden voor individuele afstanden; dit addendum breidt uit zonder de hoofdlijnen te wijzigen.

**Voortbouwend op:** Virtuele klassering en eindtijdvoorspelling (**FR5**, **FR5a**), afstandsoverzicht (**FR9**), bestaande stack (**AR1–AR3**). Meerkampmodus wordt geactiveerd voor events van type allround of sprint (zie eventconfig, bijv. `server/config/events.js`: `getDistancesForEvent` op basis van eventnaam).

---

## 9. Meerkamp-extensie (Allround & Sprint Kampioenschappen)

### 9.1 Context en Toepassingsgebied

Van toepassing op:
- EK/WK Allround (mannen: 500/5000/1500/10.000 m; vrouwen: 500/3000/1500/5000 m)
- EK/WK Sprint (2× 500 m + 2× 1000 m)
- NK Allround en andere nationale meerkampkampioenschappen

Activeerbaar via kampioenschapstype-selector; bij activatie worden meerkamp-componenten naast de bestaande afstandsweergave geladen. Event type = allround | sprint fungeert als trigger voor meerkampmodus (aansluiting op bestaande eventconfig).

---

### 9.2 Puntensysteem (Samalog)

| ID | Definitie |
|----|-----------|
| MC1 | Samalogpunten per afstand: `p = tijd(s) / afstand(km)` (500 m = 0,5 km, 1000 m = 1 km, etc.) |
| MC2 | Kampioensscore = som van punten over alle afstanden |
| MC3 | Laagste totaalscore wint |
| MC4 | DNS/DNF op één afstand = diskwalificatie totaalklassement; rijder apart markeren (wel in lijst tonen, uitgesloten van kampioensklassement en "wie kan nog winnen") |
| MC5 | Tussenstand na elke afstand wordt opgeslagen en doorzoekbaar (backend + API) |

---

### 9.3 Virtueel Kampioenklassement

Gebaseerd op virtuele klassering en eindtijdvoorspelling uit het hoofd-PRD (**FR5**, **FR5a**).

| ID | Requirement |
|----|-------------|
| MC6 | Toon lopend totaalklassement op basis van **gefinishte** afstanden |
| MC7 | Integreer **virtuele punten** van de lopende rit (op basis van huidige cumulatieve tijd geëxtrapoleerd naar eindtijd **FR5a**;zelfde extrapolatie, vertaald naar Samalog-punten) |
| MC8 | Klassement toont: positie · naam · land · punten (gefinisht) · virtuele punten (lopend) · verschil met #1 |
| MC9 | Markeer rijders die nog moeten starten op de lopende afstand (hun positie is nog beïnvloedbaar) |
| MC10 | Toon resterende afstanden in het kampioenschap met verwachte invloed op klassement |

---

### 9.4 Tijdsdoelberekening per Rijder

Kern: puntenachterstand op #1 omzetten naar benodigde tijd op de **huidige of toekomstige** afstand.

| ID | Requirement |
|----|-------------|
| MC11 | Bereken per rijder: puntenverschil t.o.v. huidige virtuele #1 |
| MC12 | Vertaal puntenverschil naar benodigde tijdwinst op huidige afstand: `Δt = Δp × afstand(km)` |
| MC13 | Toon per rijder: "Moet [+/−X.XX s] halen t.o.v. [referentierijder] om #1 te worden" |
| MC14 | Referentierijder configureerbaar: virtuele #1, actuele leider, specifieke concurrent (bijv. dropdown/keuze in UI; consistent met **FR11**: referentie kiezen) |
| MC15 | Toon dit doel ook als **rondetijddoelstelling** per ronde (wat moet de split zijn om op schema te liggen); aansluiting op bestaande rondetijd-logica (RaceView, SkaterCard) |
| MC16 | Kleurcode: groen = op schema voor #1, oranje = bereikbaar maar krap, rood = buiten bereik op basis van PR |

---

### 9.5 Resterende Afstanden Analyse

| ID | Requirement |
|----|-------------|
| MC17 | Na elke afstand: toon "wie kan nog kampioen worden" op basis van maximaal haalbare punten (PR als ondergrens) |
| MC18 | Toon voor top-10: benodigde tijden op elke resterende afstand voor #1-klassering |
| MC19 | "Worst-case / best-case" bandbreedte per rijder over resterende afstanden |

---

### 9.6 Kampioenschapsoverzicht (nieuw scherm)

Aanvullend scherm naast het bestaande afstandsoverzicht (**FR9**).

| ID | Requirement |
|----|-------------|
| MC20 | Toon volledig schema: afstanden, startlijsten, tussenstand na elke afstand (uitbreiding/parallel aan FR9) |
| MC21 | Klikbaar per afstand → laad die rit in hoofdscherm |
| MC22 | Historische tussenstand per moment in kampioenschap doorzoekbaar |
| MC23 | Vergelijk huidige kampioenstand met historische kampioenschappen (optioneel v1.4) |

---

### 9.7 Architectuur-implicaties Meerkamp

Bouwt voort op **AR1–AR3** (frontend, backend, config).

| ID | Implicatie |
|----|------------|
| AR4 | Backend uitbreiden met Samalog-rekenmodule en tussenstandopslag per fase |
| AR5 | Datamodel: kampioenschap → afstanden[] → ritten[] → rijders[] → tussenstand[] (uitbreiding huidige structuur events → afstanden → ritten met tussenstand per fase) |
| AR6 | Databron uitbreiden: kampioenschapsschema's en startlijsten per afstand (zelfde bronnen: isuresults.eu, schaatsen.nl; andere endpoints/pagina's) |
| AR7 | UI: toggle individuele afstand ↔ kampioensmodus; beide tegelijk op breed scherm (aansluiting EventSelector, RaceView) |

---

### 9.8 Roadmap-update

| Versie | Scope |
|--------|-------|
| **v1.0** | MVP individuele afstanden (ongewijzigd) |
| **v1.1** | Grafieken, meerdere toernooien (ongewijzigd) |
| **v1.2** | Meerkamp basisklassement + Samalog berekening + tijdsdoel per rijder |
| **v1.3** | Resterende afstanden analyse, "wie kan nog winnen", kampioenschapsoverzicht |
| **v1.4** | Historische kampioenschapsvergelijking, persoonlijke settings, CSV-export |

---

> _Addendum op [prd.md](prd.md). Meerkamp-scope en roadmap: zie sectie 9.8._
