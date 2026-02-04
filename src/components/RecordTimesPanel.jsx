import React from 'react'
import { formatTime } from '../utils/timeFormat'

export function RecordTimesPanel({ 
  distance,
  standings,
  skaters,
  distanceRecords,
  isOlympicEvent 
}) {
  // Best time so far (leider) from standings
  const leaderTime = standings?.[0]?.time || null
  const leader = standings?.[0] || null

  // Get PR/SB from current skaters
  const skaterRecords = skaters?.map(s => ({
    name: s.name,
    pr: s.pr,
    seasonBest: s.seasonBest
  })).filter(s => s.pr || s.seasonBest) || []

  return (
    <div className="records-panel">
      <div className="records-header">
        <h3 className="records-title">Referentietijden</h3>
        <span className="records-distance">{distance}m</span>
      </div>

      <div className="records-grid">
        {/* Best time so far */}
        {leaderTime && (
          <RecordItem
            label="Beste tijd (nu)"
            time={leaderTime}
            holder={leader?.name}
            country={leader?.country}
            highlight="leader"
          />
        )}

        {/* Current skaters PR */}
        {skaterRecords.map((skater, idx) => (
          <RecordItem
            key={idx}
            label={`PR ${skater.name?.split(' ').pop() || 'Rijder'}`}
            time={skater.pr}
            sublabel={skater.seasonBest ? `SB: ${formatTime(skater.seasonBest)}` : null}
            highlight="pr"
          />
        ))}

        {/* Track record */}
        {distanceRecords?.trackRecord && (
          <RecordItem
            label="Baanrecord"
            time={distanceRecords.trackRecord.time}
            holder={distanceRecords.trackRecord.holder}
            country={distanceRecords.trackRecord.country}
            date={distanceRecords.trackRecord.date}
            highlight="track"
          />
        )}

        {/* World record */}
        {distanceRecords?.worldRecord && (
          <RecordItem
            label="Wereldrecord"
            time={distanceRecords.worldRecord.time}
            holder={distanceRecords.worldRecord.holder}
            country={distanceRecords.worldRecord.country}
            date={distanceRecords.worldRecord.date}
            venue={distanceRecords.worldRecord.venue}
            highlight="world"
          />
        )}

        {/* Olympic record (only for Olympic events) */}
        {isOlympicEvent && distanceRecords?.olympicRecord && (
          <RecordItem
            label="Olympisch record"
            time={distanceRecords.olympicRecord.time}
            holder={distanceRecords.olympicRecord.holder}
            country={distanceRecords.olympicRecord.country}
            date={distanceRecords.olympicRecord.date}
            venue={distanceRecords.olympicRecord.venue}
            highlight="olympic"
          />
        )}
      </div>
    </div>
  )
}

function RecordItem({ label, time, holder, country, date, venue, sublabel, highlight }) {
  if (!time) return null

  return (
    <div className={`record-item record-${highlight}`}>
      <div className="record-label">{label}</div>
      <div className="record-time">{formatTime(time)}</div>
      {holder && (
        <div className="record-holder">
          <span className="holder-name">{holder}</span>
          {country && <span className="holder-country">{country}</span>}
        </div>
      )}
      {sublabel && (
        <div className="record-sublabel">{sublabel}</div>
      )}
      {(date || venue) && (
        <div className="record-meta">
          {venue && <span>{venue}</span>}
          {date && venue && <span> · </span>}
          {date && <span>{formatDate(date)}</span>}
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`
}
