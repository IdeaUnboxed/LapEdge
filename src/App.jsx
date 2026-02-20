import React, { useState, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { EventSelector } from './components/EventSelector'
import { DistanceSelector } from './components/DistanceSelector'
import { RaceView } from './components/RaceView'
import { StandingsPanel } from './components/StandingsPanel'
import { MeerkampStandingsPanel } from './components/MeerkampStandingsPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { useSettings } from './hooks/useSettings'
import { useLiveData } from './hooks/useLiveData'

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedDistance, setSelectedDistance] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showMeerkamp, setShowMeerkamp] = useState(false)
  const [reference, setReference] = useState('leader') // leader, pr, seasonBest, even

  const { settings, updateSettings } = useSettings()
  const { raceData, standings, distanceRecords, loading, error } = useLiveData(
    selectedEvent?.id,
    selectedDistance,
    settings.updateInterval,
    settings.gender || 'men'
  )

  const handleEventSelect = useCallback((event) => {
    setSelectedEvent(event)
    setSelectedDistance(null)
    // Auto-enable meerkamp for allround/sprint events
    if (event && (event.eventType === 'allround' || event.eventType === 'sprint')) {
      setShowMeerkamp(true)
    } else {
      setShowMeerkamp(false)
    }
  }, [])

  const handleDistanceSelect = useCallback((distance) => {
    setSelectedDistance(distance)
  }, [])

  const handleGenderChange = useCallback((gender) => {
    updateSettings({ ...settings, gender })
  }, [settings, updateSettings])

  return (
    <div className="app">
      <Header
        onSettingsClick={() => setShowSettings(true)}
        eventName={selectedEvent?.name}
      />

      <main className="main-content">
        <div className="sidebar">
          <EventSelector
            selectedEvent={selectedEvent}
            onSelect={handleEventSelect}
          />

          {selectedEvent && (
            <DistanceSelector
              eventId={selectedEvent.id}
              selectedDistance={selectedDistance}
              onSelect={handleDistanceSelect}
              gender={settings.gender || 'men'}
              onGenderChange={handleGenderChange}
            />
          )}

          {selectedDistance && standings && !showMeerkamp && (
            <StandingsPanel
              standings={standings}
              distance={selectedDistance}
            />
          )}

          {selectedEvent && showMeerkamp && (selectedEvent.eventType === 'allround' || selectedEvent.eventType === 'sprint') && (
            <MeerkampStandingsPanel
              eventId={selectedEvent.id}
              gender={settings.gender || 'men'}
              updateInterval={settings.updateInterval || 5000}
            />
          )}
        </div>

        <div className="main-panel">
          {selectedEvent && (selectedEvent.eventType === 'allround' || selectedEvent.eventType === 'sprint') && (
            <div className="meerkamp-toggle">
              <button
                className={!showMeerkamp ? 'active' : ''}
                onClick={() => setShowMeerkamp(false)}
              >
                Individuele Afstand
              </button>
              <button
                className={showMeerkamp ? 'active' : ''}
                onClick={() => setShowMeerkamp(true)}
              >
                Meerkamp Klassement
              </button>
            </div>
          )}

          {!selectedEvent && (
            <div className="placeholder">
              <div className="placeholder-icon">🏃</div>
              <h2>Selecteer een wedstrijd</h2>
              <p>Kies een evenement uit de lijst om live rondetijden te volgen</p>
            </div>
          )}

          {selectedEvent && !selectedDistance && (
            <div className="placeholder">
              <div className="placeholder-icon">📏</div>
              <h2>Selecteer een afstand</h2>
              <p>Kies een afstand om de live race data te zien</p>
            </div>
          )}

          {selectedEvent && selectedDistance && (
            <RaceView
              raceData={raceData}
              standings={standings}
              distanceRecords={distanceRecords}
              distance={selectedDistance}
              reference={reference}
              onReferenceChange={setReference}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </main>

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App
