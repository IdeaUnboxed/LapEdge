import { useState, useEffect, useRef, useCallback } from 'react'

export function useLiveData(eventId, distance, updateInterval = 3000, gender = 'men') {
  const [raceData, setRaceData] = useState(null)
  const [standings, setStandings] = useState(null)
  const [distanceRecords, setDistanceRecords] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const intervalRef = useRef(null)
  const abortControllerRef = useRef(null)

  const fetchData = useCallback(async () => {
    if (!eventId || !distance) {
      setRaceData(null)
      setStandings(null)
      return
    }

    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      // Fetch race data and standings in parallel
      const [raceResponse, standingsResponse] = await Promise.all([
        fetch(`/api/live/${eventId}/${distance}?gender=${gender}`, { signal }),
        fetch(`/api/standings/${eventId}/${distance}?gender=${gender}`, { signal })
      ])

      if (signal.aborted) return

      if (raceResponse.ok) {
        const race = await raceResponse.json()
        setRaceData(race)
      } else {
        throw new Error(`Race data error: ${raceResponse.status}`)
      }

      if (standingsResponse.ok) {
        const stand = await standingsResponse.json()
        setStandings(stand)
      }

      setError(null)
    } catch (err) {
      if (err.name === 'AbortError') return

      console.error('Failed to fetch live data:', err)
      setError(err.message)
    }
  }, [eventId, distance, gender])

  // Fetch distance records (static, no polling needed)
  useEffect(() => {
    if (!eventId || !distance) {
      setDistanceRecords(null)
      return
    }

    const fetchRecords = async () => {
      try {
        const response = await fetch(`/api/distance-records/${eventId}/${distance}?gender=${gender}`)
        if (response.ok) {
          const records = await response.json()
          setDistanceRecords(records)
        }
      } catch (err) {
        console.warn('Failed to fetch distance records:', err)
      }
    }

    fetchRecords()
  }, [eventId, distance, gender])

  // Initial fetch
  useEffect(() => {
    if (eventId && distance) {
      setLoading(true)
      fetchData().finally(() => setLoading(false))
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [eventId, distance, fetchData])

  // Polling interval
  useEffect(() => {
    if (!eventId || !distance) return

    intervalRef.current = setInterval(fetchData, updateInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [eventId, distance, updateInterval, fetchData])

  // Manual refresh function
  const refresh = useCallback(() => {
    setLoading(true)
    return fetchData().finally(() => setLoading(false))
  }, [fetchData])

  return {
    raceData,
    standings,
    distanceRecords,
    loading,
    error,
    refresh
  }
}
