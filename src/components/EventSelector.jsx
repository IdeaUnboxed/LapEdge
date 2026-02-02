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

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Wedstrijden</span>
      </div>

      <div className="event-list">
        {events.map(event => (
          <button
            key={event.id}
            className={`event-item ${selectedEvent?.id === event.id ? 'active' : ''}`}
            onClick={() => onSelect(event)}
          >
            <div className="event-info">
              <div className="event-name">{event.name}</div>
              <div className="event-location">{event.location}</div>
              <div className="event-date">{formatDate(event.startDate, event.endDate)}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
