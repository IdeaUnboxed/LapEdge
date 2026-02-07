import React, { useState, useEffect } from 'react'

export function Countdown({ targetDate, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate)
      setTimeLeft(newTimeLeft)
      
      if (newTimeLeft.total <= 0 && onComplete) {
        onComplete()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  if (timeLeft.total <= 0) {
    return (
      <div className="countdown finished">
        <span className="countdown-label">Het evenement zou nu moeten beginnen!</span>
      </div>
    )
  }

  return (
    <div className="countdown">
      <div className="countdown-label">Start over</div>
      <div className="countdown-timer">
        {timeLeft.days > 0 && (
          <div className="countdown-unit">
            <span className="countdown-value">{timeLeft.days}</span>
            <span className="countdown-suffix">d</span>
          </div>
        )}
        <div className="countdown-unit">
          <span className="countdown-value">{padZero(timeLeft.hours)}</span>
          <span className="countdown-suffix">u</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <span className="countdown-value">{padZero(timeLeft.minutes)}</span>
          <span className="countdown-suffix">m</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <span className="countdown-value">{padZero(timeLeft.seconds)}</span>
          <span className="countdown-suffix">s</span>
        </div>
      </div>
    </div>
  )
}

function calculateTimeLeft(targetDate) {
  const target = new Date(targetDate)
  const now = new Date()
  const total = target - now

  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))

  return { total, days, hours, minutes, seconds }
}

function padZero(num) {
  return num.toString().padStart(2, '0')
}
