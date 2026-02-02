import express from 'express'
import cors from 'cors'
import { LiveDataService } from './services/liveData.js'
import { RecordsService } from './services/records.js'
import { EventsConfig } from './config/events.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const liveDataService = new LiveDataService()
const recordsService = new RecordsService()

// Get available events/competitions
app.get('/api/events', (req, res) => {
  res.json(EventsConfig.getActiveEvents())
})

// Get distances for an event
app.get('/api/events/:eventId/distances', (req, res) => {
  const distances = EventsConfig.getDistances(req.params.eventId)
  res.json(distances)
})

// Get live race data for a specific event/distance
app.get('/api/live/:eventId/:distance', async (req, res) => {
  try {
    const { eventId, distance } = req.params
    const data = await liveDataService.getRaceData(eventId, parseInt(distance))
    res.json(data)
  } catch (error) {
    console.error('Error fetching live data:', error.message)
    res.status(500).json({ error: 'Failed to fetch live data' })
  }
})

// Get current race standings
app.get('/api/standings/:eventId/:distance', async (req, res) => {
  try {
    const { eventId, distance } = req.params
    const standings = await liveDataService.getStandings(eventId, parseInt(distance))
    res.json(standings)
  } catch (error) {
    console.error('Error fetching standings:', error.message)
    res.status(500).json({ error: 'Failed to fetch standings' })
  }
})

// Get PR/season best for a skater
app.get('/api/records/:skaterId', async (req, res) => {
  try {
    const { skaterId } = req.params
    const { distance } = req.query
    const records = await recordsService.getSkaterRecords(skaterId, distance ? parseInt(distance) : null)
    res.json(records)
  } catch (error) {
    console.error('Error fetching records:', error.message)
    res.status(500).json({ error: 'Failed to fetch records' })
  }
})

// Get skater info with PR/SB
app.get('/api/skater/:skaterId', async (req, res) => {
  try {
    const { skaterId } = req.params
    const info = await recordsService.getSkaterInfo(skaterId)
    res.json(info)
  } catch (error) {
    console.error('Error fetching skater info:', error.message)
    res.status(500).json({ error: 'Failed to fetch skater info' })
  }
})

app.listen(PORT, () => {
  console.log(`LapEdge server running on port ${PORT}`)
})
