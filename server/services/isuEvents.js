/**
 * Fetches upcoming events from ISU API (api.isuresults.eu).
 * Used to populate the event dropdown alongside config events.
 */
import fetch from 'node-fetch'
import { EventsConfig } from '../config/events.js'

const API_BASE = 'https://api.isuresults.eu'
const FETCH_TIMEOUT_MS = 10000

function normalizeIsuEvent(apiEvent) {
  if (!apiEvent?.isuId) return null
  const track = apiEvent.track || {}
  const location = track.name && track.city
    ? `${track.name}, ${track.city}`
    : track.name || track.city || '–'
  const isOlympic = Array.isArray(apiEvent.tags) && apiEvent.tags.includes('olympic')
  const event = {
    id: apiEvent.isuId,
    name: apiEvent.name,
    location,
    country: track.country || apiEvent.nationalFederation || '–',
    startDate: apiEvent.start,
    endDate: apiEvent.end,
    source: 'isuresults',
    sourceUrl: 'https://live.isuresults.eu',
    isuEventId: apiEvent.isuId,
    timezone: track.timeZone || 'UTC',
    isOlympic
  }
  // Add eventType
  event.eventType = EventsConfig.getEventType(event)
  return event
}

async function fetchSeason(season) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const url = `${API_BASE}/events/?season=${season}`
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    if (!res.ok) return []
    const data = await res.json()
    const list = Array.isArray(data.results) ? data.results : []
    return list
      .filter(e => e.isuId && !e.isCancelled)
      .map(normalizeIsuEvent)
      .filter(Boolean)
  } catch (err) {
    clearTimeout(timeoutId)
    console.warn('[ISU Events] Fetch failed for season', season, err.message)
    return []
  }
}

/**
 * Fetches ISU events for current and next season, registers them in EventsConfig,
 * returns merged list (config events first, then ISU-only events without duplicate isuId).
 */
export async function fetchAndMergeIsuEvents() {
  const currentYear = new Date().getFullYear()
  const seasons = [currentYear, currentYear + 1]
  const bySeason = await Promise.all(seasons.map(s => fetchSeason(s)))
  const isuEvents = bySeason.flat()
  const seen = new Set()
  const deduped = isuEvents.filter(e => {
    if (seen.has(e.id)) return false
    seen.add(e.id)
    return true
  })

  EventsConfig.registerIsuEvents(deduped)

  const configEvents = EventsConfig.getActiveEvents().map(event => ({
    ...event,
    eventType: EventsConfig.getEventType(event)
  }))
  const configIsuIds = new Set(
    configEvents.map(e => e.isuEventId).filter(Boolean)
  )
  const isuOnly = deduped.filter(e => !configIsuIds.has(e.id))
  const merged = [...configEvents, ...isuOnly]
  merged.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  return merged
}
