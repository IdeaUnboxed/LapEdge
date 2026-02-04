# LapEdge

Second-screen webapp voor langebaan schaatsfans met live rondetijden, virtuele klassering, en eindtijdvoorspellingen.

## Stack

- **Frontend**: React 18 + Vite + Chart.js
- **Backend**: Express + Node.js
- **Data**: ISU Results, Schaatsen.nl live feeds

## Setup

```bash
# Install dependencies
npm install

# Optional: Copy environment config
cp .env.example .env
```

## Development

```bash
# Start both frontend (3000) + backend (3001)
npm run dev

# Or run separately:
npm run dev:client  # Vite dev server
npm run dev:server  # Express API server
```

Frontend: http://localhost:3000  
Backend API: http://localhost:3001/api

## Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## API Endpoints

- `GET /api/events` - Actieve wedstrijden
- `GET /api/events/:eventId/distances` - Afstanden per event
- `GET /api/live/:eventId/:distance` - Live race data
- `GET /api/standings/:eventId/:distance` - Huidige klassering
- `GET /api/records/:skaterId?distance=X` - PR/seizoensbeste
- `GET /api/skater/:skaterId` - Rijder info + records

## Project Structure

```
server/
  adapters/      # Data source adapters (ISU, Schaatsen.nl)
  config/        # Event configuration
  services/      # Live data + records services
src/
  components/    # React UI components
  hooks/         # Custom React hooks
  utils/         # Calculations, formatting
```

## License

MIT
