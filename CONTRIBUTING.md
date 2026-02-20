# Bijdragen aan LapEdge

Bedankt voor je interesse om bij te dragen aan LapEdge! Dit document bevat richtlijnen en informatie om je op weg te helpen.

## Code of Conduct

- Wees respectvol en constructief
- Focus op het verbeteren van de applicatie
- Accepteer constructieve kritiek
- Help anderen waar mogelijk

## Hoe kan ik bijdragen?

### Bug Reports

Als je een bug vindt:

1. Controleer of de bug al gerapporteerd is in de [Issues](https://github.com/your-repo/lapedge/issues)
2. Als deze nog niet bestaat, maak dan een nieuwe issue aan
3. Gebruik een duidelijke titel en beschrijving
4. Voeg toe:
   - Stappen om de bug te reproduceren
   - Verwacht gedrag vs. actueel gedrag
   - Screenshots indien relevant
   - Browser/OS informatie
   - Console errors (indien aanwezig)

**Bug Report Template:**
```markdown
**Beschrijving**
[Korte beschrijving van de bug]

**Stappen om te reproduceren**
1. Ga naar '...'
2. Klik op '...'
3. Scroll naar '...'
4. Zie fout

**Verwacht gedrag**
[Wat had er moeten gebeuren]

**Screenshots**
[Indien van toepassing]

**Omgeving**
- Browser: [bijv. Chrome 120, Firefox 121]
- OS: [bijv. Windows 11, macOS 14]
- LapEdge versie: [bijv. 1.0.0]
```

### Feature Requests

Voor nieuwe functionaliteit:

1. Controleer eerst de [PRD.md](./prd.md) voor geplande features
2. Zoek in bestaande issues of de feature al voorgesteld is
3. Maak een nieuwe issue aan met:
   - Duidelijke titel
   - Beschrijving van de gewenste functionaliteit
   - Waarom deze feature nuttig zou zijn
   - Eventuele voorbeelden of mockups

### Pull Requests

We verwelkomen pull requests! Volg deze stappen:

1. **Fork de repository**
2. **Maak een feature branch**
   ```bash
   git checkout -b feature/mijn-nieuwe-feature
   ```
3. **Maak je wijzigingen**
4. **Test je code**
5. **Commit je wijzigingen**
   ```bash
   git commit -m "feat: voeg nieuwe feature toe"
   ```
6. **Push naar je fork**
   ```bash
   git push origin feature/mijn-nieuwe-feature
   ```
7. **Open een Pull Request**

#### Pull Request Guidelines

- **Een PR per feature**: Houd PRs gefocust op één feature of bugfix
- **Beschrijvende titel**: Gebruik conventional commits format
- **Uitgebreide beschrijving**: Leg uit wat je hebt gewijzigd en waarom
- **Update documentatie**: Als je features toevoegt, update README.md en CHANGELOG.md
- **Test je code**: Zorg dat alles werkt zoals verwacht
- **Code quality**: Volg de bestaande code style

**PR Template:**
```markdown
## Beschrijving
[Beschrijf je wijzigingen]

## Type wijziging
- [ ] Bug fix
- [ ] Nieuwe feature
- [ ] Breaking change
- [ ] Documentatie update

## Checklist
- [ ] Code is getest
- [ ] Documentatie is bijgewerkt
- [ ] CHANGELOG.md is bijgewerkt
- [ ] Geen console errors
- [ ] Code volgt project stijl
```

## Development Setup

### Vereisten

- Node.js 18+
- npm 8+
- Git

### Lokale Setup

```bash
# Clone je fork
git clone https://github.com/jouw-username/lapedge.git
cd lapedge

# Installeer dependencies
npm install

# Start development servers
npm run dev
```

### Project Structuur

```
lapedge/
├── server/          # Backend Express server
│   ├── adapters/    # Data source adapters
│   ├── config/      # Configuratie bestanden
│   └── services/    # Business logic services
├── src/             # Frontend React app
│   ├── components/  # React componenten
│   ├── hooks/       # Custom React hooks
│   └── utils/       # Utility functies
└── public/          # Statische bestanden
```

### Code Style

#### JavaScript/JSX

- **ESM modules**: Gebruik `import/export`, geen `require()`
- **Arrow functions**: Gebruik `const fn = () => {}` voor callbacks
- **Destructuring**: Gebruik destructuring waar mogelijk
- **Template literals**: Gebruik `` `${var}` `` in plaats van `'' + var`
- **Async/await**: Voorkeur boven `.then()` chains

**Goed:**
```javascript
const fetchData = async (id) => {
  try {
    const response = await fetch(`/api/data/${id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
```

**Vermijd:**
```javascript
function fetchData(id) {
  return fetch('/api/data/' + id)
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      return data
    })
    .catch(function(error) {
      console.error('Error:', error)
    })
}
```

#### React Components

- **Functional components**: Gebruik function components met hooks
- **Props destructuring**: Destructure props in de functie signature
- **Early returns**: Return early voor loading/error states
- **Named exports**: Gebruik `export function ComponentName()`

**Component Template:**
```javascript
export function MyComponent({ prop1, prop2, onAction }) {
  const [state, setState] = useState(null)

  // Early return voor loading
  if (!state) {
    return <div>Loading...</div>
  }

  // Event handlers
  const handleClick = () => {
    onAction(state)
  }

  return (
    <div className="my-component">
      <h2>{prop1}</h2>
      <button onClick={handleClick}>{prop2}</button>
    </div>
  )
}
```

#### CSS

- **BEM-achtige naming**: Gebruik beschrijvende class names
- **Component scoping**: Groepeer styles per component
- **Mobile-first**: Start met mobile styles, gebruik media queries voor desktop

**CSS Voorbeeld:**
```css
.my-component {
  /* Mobile styles */
  padding: 1rem;
}

.my-component__header {
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  .my-component {
    padding: 2rem;
  }
}
```

### Commit Messages

We volgen [Conventional Commits](https://www.conventionalcommits.org/):

**Format:** `<type>(<scope>): <beschrijving>`

**Types:**
- `feat`: Nieuwe feature
- `fix`: Bug fix
- `docs`: Documentatie wijzigingen
- `style`: Code formatting (geen functionaliteit)
- `refactor`: Code refactoring
- `perf`: Performance verbetering
- `test`: Test toevoegen/wijzigen
- `chore`: Build process, dependencies

**Voorbeelden:**
```bash
feat(race-view): add countdown timer for race start
fix(api): correct standings calculation for 1000m
docs(readme): update API endpoints documentation
refactor(components): simplify SkaterCard component
```

### Testing

Voordat je een PR indient:

1. **Functionaliteit testen**
   - Test je feature in verschillende browsers
   - Test op verschillende schermgroottes
   - Controleer console op errors

2. **Edge cases testen**
   - Wat gebeurt er bij geen data?
   - Wat gebeurt er bij netwerk fouten?
   - Wat gebeurt er bij ongeldige input?

3. **Performance checken**
   - Laadt de pagina nog snel?
   - Zijn er memory leaks?
   - Werkt real-time polling nog goed?

### Debugging

#### Frontend Debugging

```javascript
// Gebruik console.log strategisch
console.log('Race data:', raceData)

// Gebruik React DevTools
// Installeer: https://react.dev/learn/react-developer-tools

// Check network tab voor API calls
// Chrome DevTools -> Network -> Filter: Fetch/XHR
```

#### Backend Debugging

```javascript
// Add logging in services
console.log('[LiveData] Fetching race:', eventId, distance)

// Check server logs
// Logs verschijnen in de terminal waar je npm run dev:server draait

// Test API endpoints direct
// Gebruik browser of Postman: http://localhost:3001/api/events
```

## Hulp Nodig?

- Bekijk de [PRD.md](./prd.md) voor product requirements
- Lees de [README.md](./README.md) voor setup instructies
- Open een issue met je vraag
- Tag met label `question`

## Bedankt!

Elke bijdrage, groot of klein, wordt gewaardeerd. Bedankt dat je LapEdge beter maakt voor schaatsfans wereldwijd! 🏃‍♂️
