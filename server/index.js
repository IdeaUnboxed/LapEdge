import express from 'express'
import cors from 'cors'
import { LiveDataService } from './services/liveData.js'
import { RecordsService } from './services/records.js'
import { MeerkampStandingsService } from './services/meerkampStandings.js'
import { EventsConfig } from './config/events.js'
import { DistanceRecords } from './config/records.js'
import { fetchAndMergeIsuEvents } from './services/isuEvents.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const liveDataService = new LiveDataService()
const recordsService = new RecordsService()
const meerkampStandingsService = new MeerkampStandingsService()

// Get available events: config + komende evenementen van ISU (live.isuresults.eu)
app.get('/api/events', async (req, res) => {
  try {
    const events = await fetchAndMergeIsuEvents()
    res.json(events)
  } catch (error) {
    console.error('Error fetching events:', error.message)
    res.json(EventsConfig.getActiveEvents())
  }
})

// Get distances for an event
app.get('/api/events/:eventId/distances', (req, res) => {
  const distances = EventsConfig.getDistances(req.params.eventId)
  res.json(distances)
})

// Get meerkamp distances for an event (allround/sprint only)
app.get('/api/events/:eventId/meerkamp-distances', (req, res) => {
  const { eventId } = req.params
  const { gender = 'men' } = req.query

  const distances = EventsConfig.getMeerkampDistances(eventId, gender)

  if (!distances) {
    return res.status(404).json({
      error: 'No meerkamp distances for this event',
      eventId,
      message: 'This endpoint only works for allround and sprint events'
    })
  }

  res.json({ distances })
})

// Get live race data for a specific event/distance
app.get('/api/live/:eventId/:distance', async (req, res) => {
  try {
    const { eventId, distance } = req.params
    const gender = req.query.gender || 'women'  // 'men' or 'women'
    const data = await liveDataService.getRaceData(eventId, parseInt(distance), gender)
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
    const gender = req.query.gender || 'women'
    const standings = await liveDataService.getStandings(eventId, parseInt(distance), gender)
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

// Get distance records (WR, TR, OR)
app.get('/api/distance-records/:eventId/:distance', (req, res) => {
  try {
    const { eventId, distance } = req.params
    const { gender = 'men' } = req.query
    
    const event = EventsConfig.getEvent(eventId)
    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }

    const records = DistanceRecords.getDistanceRecords(
      parseInt(distance),
      gender,
      event.location
    )

    if (!records) {
      return res.status(404).json({ error: 'No records found for this distance' })
    }

    // Include Olympic record only for Olympic events
    const isOlympic = event.isOlympic || DistanceRecords.isOlympicEvent(event.name)
    
    res.json({
      distance: parseInt(distance),
      gender,
      venue: event.location,
      isOlympicEvent: isOlympic,
      worldRecord: records.worldRecord,
      trackRecord: records.trackRecord,
      olympicRecord: isOlympic ? records.olympicRecord : null
    })
  } catch (error) {
    console.error('Error fetching distance records:', error.message)
    res.status(500).json({ error: 'Failed to fetch distance records' })
  }
})

// Get meerkamp standings for an event
app.get('/api/meerkamp/:eventId/standings', async (req, res) => {
  try {
    const { eventId } = req.params
    const { gender = 'men', afterDistance } = req.query

    const standings = await meerkampStandingsService.getStandings(
      eventId,
      gender,
      afterDistance ? parseInt(afterDistance) : null
    )

    res.json(standings)
  } catch (error) {
    console.error('Error fetching meerkamp standings:', error.message)
    res.status(500).json({
      error: 'Failed to fetch meerkamp standings',
      message: error.message
    })
  }
})

// Clear caches and force refresh
app.post('/api/refresh', (req, res) => {
  try {
    const { type } = req.body || {}

    if (type === 'records' || !type) {
      // Clear skater records cache
      recordsService.cache.clear()
      console.log('Records cache cleared')
    }

    if (type === 'live' || !type) {
      // Clear live data cache
      liveDataService.cache.clear()
      console.log('Live data cache cleared')
    }

    if (type === 'meerkamp' || !type) {
      // Clear meerkamp cache
      meerkampStandingsService.clearCache()
      console.log('Meerkamp cache cleared')
    }
    
    res.json({ 
      success: true, 
      message: 'Cache cleared',
      clearedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error clearing cache:', error.message)
    res.status(500).json({ error: 'Failed to clear cache' })
  }
})

// Get cache status
app.get('/api/status', (req, res) => {
  res.json({
    recordsCacheSize: recordsService.cache.size,
    liveCacheSize: liveDataService.cache.size,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, () => {
  console.log(`LapEdge server running on port ${PORT}`)
})
