import { useState, useEffect } from "react"

function Timer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessions, setSessions] = useState(0)

  useEffect(() => {
    let timer
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0) {
      if (!isBreak) {
        setSessions(sessions + 1)
        setIsBreak(true)
        setTimeLeft(5 * 60)
      } else {
        setIsBreak(false)
        setTimeLeft(25 * 60)
      }
    }
    return () => clearTimeout(timer)
  }, [isRunning, timeLeft])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  const reset = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(25 * 60)
  }

  return (
    <div style={{
      position: "fixed",
      bottom: "40px",
      left: "50%",
      transform: "translateX(-50%)",
      textAlign: "center",
      color: "white",
      background: "rgba(0,0,0,0.4)",
      padding: "30px 50px",
      borderRadius: "20px",
      backdropFilter: "blur(10px)"
    }}>
      <p style={{ fontSize: "14px", letterSpacing: "3px", marginBottom: "10px" }}>
        {isBreak ? "☕ BREAK TIME" : "🎯 FOCUS TIME"} — Session {sessions + 1}
      </p>
      <h1 style={{ fontSize: "72px", fontWeight: "300", letterSpacing: "5px" }}>
        {formatTime(timeLeft)}
      </h1>
      <div style={{ marginTop: "20px", display: "flex", gap: "15px", justifyContent: "center" }}>
        <button onClick={() => setIsRunning(!isRunning)} style={btnStyle}>
          {isRunning ? "⏸ Pause" : "▶ Start"}
        </button>
        <button onClick={reset} style={btnStyle}>
          ↺ Reset
        </button>
      </div>
    </div>
  )
}

const btnStyle = {
  padding: "10px 25px",
  background: "rgba(255,255,255,0.2)",
  border: "1px solid rgba(255,255,255,0.4)",
  borderRadius: "25px",
  color: "white",
  fontSize: "14px",
  cursor: "pointer"
}

export default Timer