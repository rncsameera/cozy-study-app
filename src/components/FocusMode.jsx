import { useState, useEffect, useRef } from "react"
import { Howl } from "howler"

import rainSrc from "../assets/sounds/rain.mp3"
import fireSrc from "../assets/sounds/fireplace.mp3"
import brownSrc from "../assets/sounds/brownnoise.mp3"
import forestSrc from "../assets/sounds/forest.mp3"
import cafeSrc from "../assets/sounds/cafe.mp3"
import whiteSrc from "../assets/sounds/whitenoise.mp3"

const SOUNDS = [
  { id: "rain",      emoji: "🌧️", src: rainSrc },
  { id: "fireplace", emoji: "🔥", src: fireSrc },
  { id: "brown",     emoji: "🌊", src: brownSrc },
  { id: "white",     emoji: "🌬️", src: whiteSrc },
  { id: "forest",    emoji: "🌿", src: forestSrc },
  { id: "cafe",      emoji: "☕", src: cafeSrc },
]

const FALLBACK_QUOTES = [
  { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { content: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { content: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { content: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { content: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { content: "Small progress is still progress.", author: "Unknown" },
  { content: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { content: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
]

export default function FocusMode({
  scene, onExit, externalPreset,
  focusTime, breakTime, onSaveNote
}) {
  const [timeLeft, setTimeLeft]         = useState((focusTime || 25) * 60)
  const [isRunning, setIsRunning]       = useState(true)
  const [isBreak, setIsBreak]           = useState(false)
  const [sessions, setSessions]         = useState(0)
  const [showLocation, setShowLocation] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [note, setNote]                 = useState("")
  const [noteSaved, setNoteSaved]       = useState(false)
  const [quote, setQuote]               = useState(FALLBACK_QUOTES[0])
  const [quoteVisible, setQuoteVisible] = useState(true)
  const [tasks, setTasks]               = useState(() => {
    const saved = localStorage.getItem("stillspace-tasks")
    return saved ? JSON.parse(saved) : []
  })
  const [volumes, setVolumes] = useState(
    externalPreset || { rain: 0, fireplace: 0, brown: 0, white: 0, forest: 0, cafe: 0 }
  )
  const howls = useRef({})

  // Hide controls after 3 seconds
  useEffect(() => {
    let timeout
    const show = () => {
      setShowControls(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setShowControls(false), 3000)
    }
    window.addEventListener("mousemove", show)
    window.addEventListener("keydown", show)
    show()
    return () => {
      window.removeEventListener("mousemove", show)
      window.removeEventListener("keydown", show)
      clearTimeout(timeout)
    }
  }, [])

  // ESC to exit
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onExit() }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  // Timer logic
  useEffect(() => {
    let timer
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0) {
      if (!isBreak) {
        setSessions(s => s + 1)
        setIsBreak(true)
        setTimeLeft((breakTime || 5) * 60)
      } else {
        setIsBreak(false)
        setTimeLeft((focusTime || 25) * 60)
      }
    }
    return () => clearTimeout(timer)
  }, [isRunning, timeLeft, isBreak])

  // Sound init
  useEffect(() => {
    SOUNDS.forEach(s => {
      howls.current[s.id] = new Howl({ src: [s.src], loop: true, volume: 0 })
    })
    return () => Object.values(howls.current).forEach(h => h.unload())
  }, [])

  // Sync volumes
  useEffect(() => {
    SOUNDS.forEach(s => {
      const h = howls.current[s.id]
      if (!h) return
      const vol = volumes[s.id] / 100
      h.volume(vol)
      if (vol > 0 && !h.playing()) h.play()
      if (vol === 0 && h.playing()) h.stop()
    })
  }, [volumes])

  // Sync external preset
  useEffect(() => {
    if (externalPreset) setVolumes(externalPreset)
  }, [externalPreset])

  // Quote fetch
  const fetchQuote = async () => {
    try {
      const res = await fetch("https://api.quotable.io/random?tags=inspirational,success,education")
      const data = await res.json()
      if (data.content) setQuote({ content: data.content, author: data.author })
      else throw new Error()
    } catch {
      const random = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
      setQuote(random)
    }
  }

  const changeQuote = async () => {
    setQuoteVisible(false)
    setTimeout(async () => {
      await fetchQuote()
      setQuoteVisible(true)
    }, 400)
  }

  useEffect(() => { fetchQuote() }, [])
  useEffect(() => {
    const interval = setInterval(changeQuote, 10 * 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0")
    const sec = (s % 60).toString().padStart(2, "0")
    return `${m}:${sec}`
  }

  const isMuted = Object.values(volumes).every(v => v === 0)

  const toggleMute = () => {
    if (isMuted) {
      setVolumes(externalPreset || { rain: 30, fireplace: 0, brown: 0, white: 0, forest: 20, cafe: 0 })
    } else {
      setVolumes({ rain: 0, fireplace: 0, brown: 0, white: 0, forest: 0, cafe: 0 })
    }
  }

  const toggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    setTasks(updated)
    localStorage.setItem("stillspace-tasks", JSON.stringify(updated))
  }

  const handleSaveNote = async () => {
    if (note.trim() && onSaveNote) {
      await onSaveNote(note)
      setNote("")
      setNoteSaved(true)
      setTimeout(() => setNoteSaved(false), 2000)
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      color: "white", fontFamily: "Georgia, serif"
    }}>

      {/* ESC hint */}
      {showControls && (
        <div style={{
          position: "fixed", top: "16px", left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.35)", fontSize: "10px",
          letterSpacing: "2px", zIndex: 102
        }}>
          ESC TO EXIT
        </div>
      )}

      {/* QUOTE — top center, always visible */}
      <div
        onClick={changeQuote}
        title="Click for new quote"
        style={{
          position: "fixed",
          top: "50px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          textAlign: "center",
          background: "rgba(0,0,0,0.35)",
          padding: "14px 28px",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          zIndex: 101,
          maxWidth: "500px",
          width: "90%",
          transition: "opacity 0.4s ease",
          opacity: quoteVisible ? 1 : 0,
          cursor: "pointer",
        }}
      >
        <p style={{ fontSize: "14px", fontStyle: "italic", marginBottom: "6px", lineHeight: "1.5", margin: "0 0 6px" }}>
          "{quote.content}"
        </p>
        <p style={{ fontSize: "11px", opacity: 0.6, letterSpacing: "1px", margin: 0 }}>
          — {quote.author}
        </p>
      </div>

      {/* TOP LEFT — Timer */}
      <div style={{
        position: "fixed", top: "30px", left: "30px",
        background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px", padding: "16px 24px",
        textAlign: "center", zIndex: 101,
        opacity: showControls ? 1 : 0.12,
        transition: "opacity 0.3s ease"
      }}>
        <p style={{ fontSize: "9px", letterSpacing: "3px", opacity: 0.5, margin: "0 0 6px" }}>
          {isBreak ? "☕ BREAK" : "🎯 FOCUS"} · S{sessions + 1}
        </p>
        <h1 style={{
          fontSize: "52px", fontWeight: "200",
          letterSpacing: "4px", margin: "0 0 12px",
          fontFamily: "monospace"
        }}>
          {formatTime(timeLeft)}
        </h1>
        <button onClick={() => setIsRunning(!isRunning)} style={btn}>
          {isRunning ? "⏸ Pause" : "▶ Resume"}
        </button>
      </div>

      {/* TOP RIGHT — Sound toggle + Exit */}
      <div style={{
        position: "fixed", top: "30px", right: "30px",
        display: "flex", gap: "10px", alignItems: "center",
        zIndex: 101,
        opacity: showControls ? 1 : 0,
        transition: "opacity 0.3s ease"
      }}>
        <button onClick={toggleMute} style={{
          ...btn,
          borderRadius: "50%", width: "40px", height: "40px",
          padding: 0, fontSize: "18px"
        }}>
          {isMuted ? "🔇" : "🔊"}
        </button>
        <button onClick={onExit} style={{
          ...btn, fontSize: "12px", letterSpacing: "1px"
        }}>
          ✕ EXIT
        </button>
      </div>

      {/* LEFT MIDDLE — Task list */}
      <div style={{
        position: "fixed", left: "30px", top: "50%",
        transform: "translateY(-50%)",
        background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px", padding: "14px 16px",
        width: "200px", zIndex: 101,
        opacity: showControls ? 1 : 0.1,
        transition: "opacity 0.3s ease"
      }}>
        <p style={{ fontSize: "9px", letterSpacing: "2px", opacity: 0.5, marginBottom: "10px" }}>
          📋 TODAY'S GOALS
        </p>
        {tasks.length === 0 && (
          <p style={{ fontSize: "11px", opacity: 0.4, textAlign: "center" }}>No tasks added</p>
        )}
        {tasks.map(task => (
          <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
              style={{ accentColor: "#64ff96", cursor: "pointer" }}
            />
            <span style={{
              fontSize: "12px",
              textDecoration: task.done ? "line-through" : "none",
              opacity: task.done ? 0.4 : 0.9
            }}>
              {task.text}
            </span>
          </div>
        ))}
      </div>

      {/* BOTTOM CENTER — Quick note */}
      <div style={{
        position: "fixed", bottom: "30px", left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px", padding: "12px 16px",
        width: "420px", zIndex: 101,
        opacity: showControls ? 1 : 0.1,
        transition: "opacity 0.3s ease"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <p style={{ fontSize: "9px", letterSpacing: "2px", opacity: 0.5, margin: 0 }}>📝 QUICK NOTE</p>
          <button onClick={handleSaveNote} style={{
            background: noteSaved ? "rgba(100,255,150,0.3)" : "rgba(100,255,150,0.15)",
            border: "1px solid rgba(100,255,150,0.3)",
            borderRadius: "8px", color: "white",
            fontSize: "10px", padding: "3px 12px",
            cursor: "pointer", letterSpacing: "1px",
            transition: "all 0.2s"
          }}>
            {noteSaved ? "✓ SAVED" : "SAVE"}
          </button>
        </div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Jot down something important..."
          style={{
            width: "100%", background: "transparent",
            border: "none", outline: "none", color: "white",
            fontSize: "13px", resize: "none", height: "60px",
            fontFamily: "Georgia, serif", lineHeight: "1.6",
            opacity: 0.85, boxSizing: "border-box"
          }}
        />
      </div>

      {/* BOTTOM RIGHT — Location */}
      {showLocation && (
        <div style={{
          position: "fixed", bottom: "30px", right: "30px",
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px", padding: "10px 14px",
          textAlign: "right", zIndex: 101,
          opacity: showControls ? 1 : 0.15,
          transition: "opacity 0.3s"
        }}>
          <p style={{ fontSize: "13px", fontWeight: "600", margin: 0 }}>{scene.name}</p>
          <p style={{ fontSize: "11px", opacity: 0.6, margin: "2px 0 6px" }}>{scene.country}</p>
          <button onClick={() => setShowLocation(false)} style={{
            background: "none", border: "none",
            color: "rgba(255,255,255,0.35)", fontSize: "10px",
            cursor: "pointer", letterSpacing: "1px"
          }}>HIDE</button>
        </div>
      )}
    </div>
  )
}

const btn = {
  padding: "7px 18px",
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "20px", color: "white",
  fontSize: "12px", cursor: "pointer"
}