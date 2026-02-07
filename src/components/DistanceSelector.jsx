import React, { useState, useEffect } from 'react'

export function DistanceSelector({ eventId, selectedDistance, onSelect, gender, onGenderChange }) {
  const [distances, setDistances] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (eventId) {
      fetchDistances()
    }
  }, [eventId])

  async function fetchDistances() {
    setLoading(true)
    try {
      const response = await fetch(`/api/events/${eventId}/distances`)
      if (response.ok) {
        const data = await response.json()
        setDistances(data)
      }
    } catch (error) {
      console.error('Failed to fetch distances:', error)
      // Fallback
      setDistances([500, 1000, 1500, 3000, 5000, 10000])
    } finally {
      setLoading(false)
    }
  }

  function formatDistance(meters) {
    if (meters >= 10000) {
      return '10.000m'
    }
    return `${meters}m`
  }

  if (loading) {
    return (
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Afstanden</span>
        </div>
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Afstanden</span>
      </div>

      {/* Gender selector */}
      <div className="gender-selector">
        <button
          className={`gender-btn ${gender === 'men' ? 'active' : ''}`}
          onClick={() => onGenderChange('men')}
        >
          Heren
        </button>
        <button
          className={`gender-btn ${gender === 'women' ? 'active' : ''}`}
          onClick={() => onGenderChange('women')}
        >
          Dames
        </button>
      </div>

      <div className="distance-list">
        {distances.map(distance => (
          <button
            key={distance}
            className={`distance-item ${selectedDistance === distance ? 'active' : ''}`}
            onClick={() => onSelect(distance)}
          >
            {formatDistance(distance)}
          </button>
        ))}
      </div>
    </div>
  )
}
