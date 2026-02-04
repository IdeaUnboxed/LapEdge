/**
 * Format seconds to mm:ss.cc or ss.cc format
 */
export function formatTime(seconds) {
  if (seconds === null || seconds === undefined) return '-'

  if (seconds < 60) {
    return seconds.toFixed(2)
  }

  const mins = Math.floor(seconds / 60)
  const secs = (seconds % 60).toFixed(2)
  return `${mins}:${secs.padStart(5, '0')}`
}

/**
 * Format time difference with + or - prefix
 */
export function formatDiff(diff) {
  if (diff === null || diff === undefined) return '-'

  const prefix = diff >= 0 ? '+' : ''
  return `${prefix}${diff.toFixed(2)}`
}

/**
 * Parse time string to seconds
 * Handles formats: "34.56", "1:23.45", "12:34.56"
 */
export function parseTime(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null

  const parts = timeStr.split(':')

  if (parts.length === 1) {
    return parseFloat(parts[0])
  }

  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10)
    const secs = parseFloat(parts[1])
    return mins * 60 + secs
  }

  if (parts.length === 3) {
    const hours = parseInt(parts[0], 10)
    const mins = parseInt(parts[1], 10)
    const secs = parseFloat(parts[2])
    return hours * 3600 + mins * 60 + secs
  }

  return null
}

/**
 * Format lap pace (seconds per 400m)
 */
export function formatPace(secondsPer400m) {
  if (!secondsPer400m) return '-'
  return `${secondsPer400m.toFixed(1)}s/400m`
}
