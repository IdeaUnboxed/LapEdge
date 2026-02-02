import React from 'react'

export function Header({ onSettingsClick, eventName }) {
  return (
    <header className="header">
      <div className="header-logo">
        <h1>LapEdge</h1>
        {eventName && (
          <span className="header-event">{eventName}</span>
        )}
      </div>

      <div className="header-actions">
        <button
          className="btn btn-secondary"
          onClick={onSettingsClick}
          title="Instellingen"
        >
          Instellingen
        </button>
      </div>
    </header>
  )
}
