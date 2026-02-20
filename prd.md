# Second-Screen Schaatsapp — Hoofdlijnen Requirements

---

## 1. Doel en Scope

**Doel:** Second-screen webapp voor langebaan schaatsfans met virtuele klassering, pacing-info, PR/seizoensvergelijkingen en eindtijdvoorspellingen op basis van live rondetijden.

**Primair gebruik:** Live tv/stream + app op tweede scherm (laptop/tablet/telefoon).

**Scope v1:** Individuele afstanden (500–10.000 m), alleen publieke live-data, geen accounts/persoonsgegevens.

---

## 2. Doelgroep en Use-Cases

**Doelgroep:** Fervente schaatsfans/ex-schaatsers met kennis van rondetijden en pacing.

**Kern use-cases:**
- Per ronde: virtuele plek vs. leider / PR / seizoensbeste
- Één oogopslag: verschillen, trends, eindvoorspelling (> 1500 m)
- Wisselen tussen afstand/rit; referentie kiezen

---

## 3. Functionele Requirements (v1)

### 3.1 Data-invoer

| ID | Requirement |
|----|-------------|
| FR1 | Selecteer wedstrijd/afstand (handmatig / lijst actieve events) |
| FR1a | Haal PR/seizoensbeste op via externe databases (`speedskatingresults.com`, `speedskatingnews.info`) |
| FR2 | Periodiek live rondetijden uit externe bron (`live.isuresults.eu`, `liveresults.schaatsen.nl`) |
| FR2a | Cache PR/seizoensbeste per rijder/afstand |

### 3.2 Berekeningen

| ID | Requirement |
|----|-------------|
| FR4 | Per ronde: cumulatieve tijd, vs. leider, vs. PR, vs. seizoensbeste (kleurcode) |
| FR5 | Virtuele klassering (huidige cumulatief vs. gefinishte ritten) |
| FR5a | Eindtijdvoorspelling (> 1500 m): extrapoleer gemiddeld/gewogen recente ronden of regressie vs. PR-schema; toon ± band |
| FR6 | Markeer rondes vs. alle referenties |

### 3.3 Visualisatie

| ID | Requirement |
|----|-------------|
| FR7 | Hoofdscherm: naam / land / afstand + tabel met kolommen: Ronde · Tijd · Cum. · vs Leider · vs PR · vs Seizoensbeste · Virt. Plek · Eindvoorsp. |
| FR8 | Grafieken: cumulatief vs. referenties; voorspelde eindbaan met confidence band |
| FR9 | Afstandsoverzicht: rittenlijst, records, PR/seizoensbeste, podiumkansen |

### 3.4 Interactie

| ID | Requirement |
|----|-------------|
| FR10 | Selecteer rit uit overzicht |
| FR11 | Kies referentie: leider / PR / seizoensbeste / vlak schema |
| FR12 | Update-interval 2–5 s instelbaar |

---

## 4. Niet-Functionele Requirements

| ID | Requirement |
|----|-------------|
| NFR1 | Responsief webapp (desktop / tablet / mobiel) |
| NFR2 | Update < 2 s na ronde |
| NFR3 | Hoge leesbaarheid, minimalistisch |
| NFR4 | Geen data-opslag behalve lokale settings |

---

## 5. Databronnen en Integratie

| ID | Bron / Eis |
|----|------------|
| DR1 | **Live:** `isuresults.eu`, `liveresults.schaatsen.nl` (HTML/JSON) |
| DR2 | **PR/Seizoensbeste:** `speedskatingresults.com`, `speedskatingnews.info`, `schaatsen.nl` |
| DR3 | Abstractie-laag voor vervanging; geen logging/herpublicatie van data |

---

## 6. Architectuur in Hoofdlijnen

| ID | Component |
|----|-----------|
| AR1 | **Frontend:** SPA (React/JS) voor UI en grafieken |
| AR2 | **Backend:** Lichte service voor data-normalisatie en JSON-API |
| AR3 | Config voor events/afstanden |

---

## 7. Privacy, Legal en Ethiek

| ID | Eis |
|----|-----|
| LR1 | Respecteer voorwaarden bronnen; persoonlijk gebruik |
| LR2 | Geen accounts / tracking / analytics |

---

## 8. Roadmap

| Versie | Scope |
|--------|-------|
| **v1.0** | MVP met tabel, één bron, basisreferenties |
| **v1.1** | Grafieken, meerdere toernooien |
| **v1.2** | Persoonlijke settings, CSV-export |

Voor meerkamp (Allround/Sprint): zie [prd-meerkamp.md](prd-meerkamp.md).

---

> _Dit is de definitieve hoofdlijnenstructuur. Klaar voor detailuitwerking per sectie._