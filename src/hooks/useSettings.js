import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'lapedge_settings'

const defaultSettings = {
  updateInterval: 3000, // 3 seconds
  defaultReference: 'leader',
  compactMode: false,
  showCharts: true
}

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
    return defaultSettings
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }, [settings])

  const updateSettings = useCallback((newSettings) => {
    setSettings(newSettings)
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
  }, [])

  return {
    settings,
    updateSettings,
    resetSettings
  }
}
