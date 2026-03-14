import { useState, useEffect, useRef } from "react"

// ─── Flip Card ────────────────────────────────────────────────────────────
function FlipCard({ value }) {
  const [current, setCurrent] = useState(value)
  const [previous, setPrevious] = useState(value)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    if (value !== current) {
      setPrevious(current)
      setFlipping(true)
      setTimeout(() => {
        setCurrent(value)
        setFlipping(false)
      }, 300)
    }
  }, [value])

  const cardStyle = {
    width: "75px",
    height: "95px",
    position: "relative",
    perspective: "400px",
  }

  const halfStyle = {
    position: "absolute",
    width: "100%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "6px",
  }

  const numStyle = {
    fontSize: "72px",
    fontWeight: "700",
    color: "white",
    fontFamily: "'Courier New', monospace",
    lineHeight: "95px",
    position: "absolute",
    userSelect: "none",
  }

  return (
    <div style={cardStyle}>
      <style>{`
        @keyframes flipTop {
          from { transform: rotateX(0deg); }
          to   { transform: rotateX(-90deg); }
        }
        @keyframes flipBottom {
          from { transform: rotateX(90deg); }
          to   { transform: rotateX(0deg); }
        }
      `}</style>

      {/* Top half — current */}
      <div style={{
        ...halfStyle, top: 0,
        background: "rgba(25,25,25,0.95)",
        alignItems: "flex-end",
        borderBottom: "1px solid rgba(0,0,0,0.5)",
      }}>
        <span style={{ ...numStyle, top: 0 }}>{current}</span>
      </div>

      {/* Bottom half — current */}
      <div style={{
        ...halfStyle, bottom: 0,
        background: "rgba(15,15,15,0.95)",
        alignItems: "flex-start",
      }}>
        <span style={{ ...numStyle, bottom: 0 }}>{current}</span>
      </div>

      {/* Flipping top (previous flips away) */}
      {flipping && (
        <div style={{
          ...halfStyle, top: 0,
          background: "rgba(35,35,35,0.98)",
          alignItems: "flex-end",
          transformOrigin: "bottom center",
          animation: "flipTop 0.3s ease-in forwards",
          zIndex: 3,
        }}>
          <span style={{ ...numStyle, top: 0 }}>{previous}</span>
        </div>
      )}

      {/* Flipping bottom (new value flips in) */}
      {flipping && (
        <div style={{
          ...halfStyle, bottom: 0,
          background: "rgba(15,15,15,0.98)",
          alignItems: "flex-start",
          transformOrigin: "top center",
          animation: "flipBottom 0.3s ease-out forwards",
          zIndex: 3,
        }}>
          <span style={{ ...numStyle, bottom: 0 }}>{value}</span>
        </div>
      )}

      {/* Center line */}
      <div style={{
        position: "absolute", top: "calc(50% - 1px)",
        width: "100%", height: "2px",
        background: "rgba(0,0,0,0.8)", zIndex: 5,
      }} />
    </div>
  )
}

// ─── Flip Clock Display ─────────────────────────────────────────────────────
function FlipClock({ minutes, seconds }) {
  const m = minutes.toString().padStart(2, "0")
  const s = seconds.toString().padStart(2, "0")

  const sepStyle = {
    fontSize: "64px", fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    fontFamily: "monospace",
    alignSelf: "center",
    marginBottom: "6px",
    lineHeight: 1,
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <FlipCard value={m[0]} />
      <FlipCard value={m[1]} />
      <span style={sepStyle}>:</span>
      <FlipCard value={s[0]} />
      <FlipCard value={s[1]} />
    </div>
  )
}

// ─── Shared button style ────────────────────────────────────────────────────
const btnStyle = {
  padding: "10px 24px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "25px",
  color: "white",
  fontSize: "13px",
  cursor: "pointer",
  letterSpacing: "0.5px",
}

// ─── Presets ────────────────────────────────────────────────────────────────
const PRESETS = [
  { label: "Classic", focus: 25, break: 5 },
  { label: "Long",    focus: 50, break: 10 },
  { label: "Short",   focus: 15, break: 3 },
]

// ─── Pomodoro ───────────────────────────────────────────────────────────────
function PomodoroTimer() {
  const [focusTime, setFocusTime]       = useState(25)
  const [breakTime, setBreakTime]       = useState(5)
  const [timeLeft, setTimeLeft]         = useState(25 * 60)
  const [isRunning, setIsRunning]       = useState(false)
  const [isBreak, setIsBreak]           = useState(false)
  const [sessions, setSessions]         = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [customFocus, setCustomFocus]   = useState(25)
  const [customBreak, setCustomBreak]   = useState(5)

  useEffect(() => {
    let timer
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0) {
      if (!isBreak) {
        setSessions(s => s + 1)
        setIsBreak(true)
        setTimeLeft(breakTime * 60)
      } else {
        setIsBreak(false)
        setTimeLeft(focusTime * 60)
      }
    }
    return () => clearTimeout(timer)
  }, [isRunning, timeLeft, focusTime, breakTime])

  const applyPreset = (p) => {
    setIsRunning(false)
    setIsBreak(false)
    setFocusTime(p.focus)
    setBreakTime(p.break)
    setTimeLeft(p.focus * 60)
    setCustomFocus(p.focus)
    setCustomBreak(p.break)
  }

  const applyCustom = () => {
    const f = Math.min(Math.max(parseInt(customFocus) || 25, 1), 120)
    const b = Math.min(Math.max(parseInt(customBreak) || 5, 1), 60)
    setIsRunning(false)
    setIsBreak(false)
    setFocusTime(f)
    setBreakTime(b)
    setTimeLeft(f * 60)
    setShowSettings(false)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "11px", letterSpacing: "3px", marginBottom: "18px", opacity: 0.6 }}>
        {isBreak ? "☕ BREAK TIME" : "🎯 FOCUS TIME"} — Session {sessions + 1}
      </p>

      <div style={{ marginBottom: "20px" }}>
        <FlipClock minutes={minutes} seconds={seconds} />
      </div>

      {/* Presets */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "12px", flexWrap: "wrap" }}>
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => applyPreset(p)} style={{
            padding: "4px 12px", borderRadius: "12px", fontSize: "11px",
            cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)",
            background: focusTime === p.focus && breakTime === p.break
              ? "rgba(100,255,150,0.3)" : "rgba(255,255,255,0.08)",
            color: "white"
          }}>
            {p.label} {p.focus}/{p.break}
          </button>
        ))}
        <button onClick={() => setShowSettings(!showSettings)} style={{
          padding: "4px 12px", borderRadius: "12px", fontSize: "11px",
          cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)",
          background: showSettings ? "rgba(255,200,100,0.3)" : "rgba(255,255,255,0.08)",
          color: "white"
        }}>⚙️ Custom</button>
      </div>

      {/* Custom inputs */}
      {showSettings && (
        <div style={{
          background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "12px",
          marginBottom: "12px", display: "flex", gap: "10px",
          alignItems: "flex-end", justifyContent: "center"
        }}>
          <div>
            <p style={{ fontSize: "10px", opacity: 0.6, marginBottom: "4px" }}>FOCUS (min)</p>
            <input type="number" min="1" max="120" value={customFocus}
              onChange={e => setCustomFocus(e.target.value)}
              style={{ width: "60px", padding: "6px", borderRadius: "8px",
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "white", fontSize: "14px", textAlign: "center", outline: "none" }}
            />
          </div>
          <div>
            <p style={{ fontSize: "10px", opacity: 0.6, marginBottom: "4px" }}>BREAK (min)</p>
            <input type="number" min="1" max="60" value={customBreak}
              onChange={e => setCustomBreak(e.target.value)}
              style={{ width: "60px", padding: "6px", borderRadius: "8px",
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "white", fontSize: "14px", textAlign: "center", outline: "none" }}
            />
          </div>
          <button onClick={applyCustom} style={{
            padding: "8px 16px", borderRadius: "10px",
            background: "rgba(100,255,150,0.3)",
            border: "1px solid rgba(100,255,150,0.4)",
            color: "white", fontSize: "12px", cursor: "pointer"
          }}>Apply</button>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button onClick={() => setIsRunning(!isRunning)} style={btnStyle}>
          {isRunning ? "⏸ Pause" : "▶ Start"}
        </button>
        <button onClick={() => {
          setIsRunning(false)
          setIsBreak(false)
          setTimeLeft(focusTime * 60)
        }} style={btnStyle}>↺ Reset</button>
      </div>
    </div>
  )
}

// ─── Stopwatch ──────────────────────────────────────────────────────────────
function Stopwatch() {
  const [time, setTime]           = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps]           = useState([])
  const intervalRef               = useRef(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setTime(t => t + 1000), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const reset = () => {
    setIsRunning(false)
    setTime(0)
    setLaps([])
  }

  const formatTime = (ms) => {
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return h > 0
      ? `${h}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`
      : `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`
  }

  const minutes = Math.floor((time % 3600000) / 60000)
  const seconds = Math.floor((time % 60000) / 1000)

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "11px", letterSpacing: "3px", marginBottom: "18px", opacity: 0.6 }}>
        ⏱️ FREE STUDY — study at your own pace
      </p>

      <div style={{ marginBottom: "20px" }}>
        <FlipClock minutes={minutes} seconds={seconds} />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "14px" }}>
        <button onClick={() => setIsRunning(!isRunning)} style={btnStyle}>
          {isRunning ? "⏸ Pause" : "▶ Start"}
        </button>
        <button onClick={() => isRunning && setLaps(l => [time, ...l])} style={{
          ...btnStyle, opacity: isRunning ? 1 : 0.4
        }}>🏁 Lap</button>
        <button onClick={reset} style={btnStyle}>↺ Reset</button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div style={{
          maxHeight: "90px", overflowY: "auto",
          background: "rgba(0,0,0,0.2)", borderRadius: "10px", padding: "8px"
        }}>
          {laps.map((lap, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              fontSize: "12px", padding: "3px 8px", opacity: 0.75
            }}>
              <span>Lap {laps.length - i}</span>
              <span>{formatTime(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Export ────────────────────────────────────────────────────────────
export default function Timer() {
  const [mode, setMode] = useState("pomodoro")

  return (
    <div style={{
      position: "fixed",
      bottom: "30px",
      left: "50%",
      transform: "translateX(-50%)",
      color: "white",
      background: "rgba(0,0,0,0.5)",
      padding: "24px 36px",
      borderRadius: "24px",
      backdropFilter: "blur(12px)",
      minWidth: "400px",
      border: "1px solid rgba(255,255,255,0.08)"
    }}>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "20px" }}>
        <button onClick={() => setMode("pomodoro")} style={{
          padding: "7px 22px", borderRadius: "20px", fontSize: "12px",
          cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)",
          background: mode === "pomodoro" ? "rgba(100,255,150,0.25)" : "rgba(255,255,255,0.07)",
          color: "white", letterSpacing: "1px"
        }}>🍅 POMODORO</button>
        <button onClick={() => setMode("stopwatch")} style={{
          padding: "7px 22px", borderRadius: "20px", fontSize: "12px",
          cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)",
          background: mode === "stopwatch" ? "rgba(100,200,255,0.25)" : "rgba(255,255,255,0.07)",
          color: "white", letterSpacing: "1px"
        }}>⏱️ STOPWATCH</button>
      </div>

      {mode === "pomodoro" ? <PomodoroTimer /> : <Stopwatch />}
    </div>
  )
}