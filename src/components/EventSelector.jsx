import React, { useState, useEffect } from 'react'

export function EventSelector({ selectedEvent, onSelect }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
      // Use fallback demo events
      setEvents([
        {
          id: 'wc-heerenveen-2024',
          name: 'World Cup Heerenveen',
          location: 'Thialf, Heerenveen',
          country: 'NED',
          startDate: '2024-12-13',
          endDate: '2024-12-15'
        },
        {
          id: 'wc-calgary-2024',
          name: 'World Cup Calgary',
          location: 'Olympic Oval, Calgary',
          country: 'CAN',
          startDate: '2024-12-06',
          endDate: '2024-12-08'
        },
        {
          id: 'nk-sprint-2024',
          name: 'NK Sprint',
          location: 'Thialf, Heerenveen',
          country: 'NED',
          startDate: '2024-12-21',
          endDate: '2024-12-22'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  function formatDate(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const options = { day: 'numeric', month: 'short' }

    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}-${end.toLocaleDateString('nl-NL', options)}`
    }
    return `${start.toLocaleDateString('nl-NL', options)} - ${end.toLocaleDateString('nl-NL', options)}`
  }

  if (loading) {
    return (
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Wedstrijden</span>
        </div>
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Laden...</span>
        </div>
      </div>
    )
  }

  function handleChange(e) {
    const value = e.target.value
    if (!value) {
      onSelect(null)
      return
    }
    const event = events.find(ev => ev.id === value)
    if (event) onSelect(event)
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Wedstrijd</span>
      </div>
      <div className="event-select-wrap">
        <select
          className="event-select"
          value={selectedEvent?.id ?? ''}
          onChange={handleChange}
          aria-label="Selecteer een wedstrijd"
        >
          <option value="">Selecteer wedstrijd...</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name} — {formatDate(event.startDate, event.endDate)}
            </option>
          ))}
        </select>
        {selectedEvent && (
          <div className="event-select-meta">
            {selectedEvent.location}
          </div>
        )}
      </div>
    </div>
  )
}
