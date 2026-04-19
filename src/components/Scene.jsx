import { useState, useEffect } from "react"
import AnimatedScene from "./AnimatedScene"

const SCENES = [
  {
    id: "darjeeling",
    name: "Darjeeling",
    country: "West Bengal, India 🇮🇳",
    soundPreset: null,
  },
  {
    id: "munnar",
    name: "Munnar",
    country: "Kerala, India 🇮🇳",
    soundPreset: null,
  },
  {
    id: "manali",
    name: "Manali",
    country: "Himachal Pradesh, India 🇮🇳",
    soundPreset: null,
  },
  {
    id: "coorg",
    name: "Coorg",
    country: "Karnataka, India 🇮🇳",
    soundPreset: null,
  },
  {
    id: "chicago-snow",
    name: "Chicago Snow",
    country: "Illinois, USA 🇺🇸",
    soundPreset: null,
  }
]

export default function Scene({ onSceneChange, focusMode }) {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const [paused, setPaused] = useState(false)

  const goTo = (index) => {
    if (fading) return
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
      if (onSceneChange) onSceneChange(
        SCENES[index].soundPreset,
        { name: SCENES[index].name, country: SCENES[index].country }
      )
    }, 500)
  }

  const prev = () => {
    setPaused(true)
    goTo((current - 1 + SCENES.length) % SCENES.length)
    setTimeout(() => setPaused(false), 10000)
  }

  const next = () => {
    setPaused(true)
    goTo((current + 1) % SCENES.length)
    setTimeout(() => setPaused(false), 10000)
  }

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      goTo((current + 1) % SCENES.length)
    }, 30000)
    return () => clearInterval(interval)
  }, [current, paused])

  return (
    <>
      {/* Background */}
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        zIndex: -1,
        opacity: fading ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}>
        <AnimatedScene sceneId={SCENES[current].id} />
      </div>

      {/* Scene Controls — hidden in focus mode */}
      {!focusMode && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "30px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          zIndex: 10,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(10px)",
          padding: "10px 20px",
          borderRadius: "30px",
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <button onClick={prev} style={arrowBtn}>‹</button>

          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {SCENES.map((_, i) => (
              <div
                key={i}
                onClick={() => {
                  setPaused(true)
                  goTo(i)
                  setTimeout(() => setPaused(false), 10000)
                }}
                style={{
                  width: i === current ? "18px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i === current
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
              />
            ))}
          </div>

          <button onClick={next} style={arrowBtn}>›</button>

          <button
            onClick={() => setPaused(!paused)}
            style={{
              ...arrowBtn,
              fontSize: "12px",
              opacity: 0.6,
              marginLeft: "4px"
            }}>
            {paused ? "▶" : "⏸"}
          </button>
        </div>
      )}
    </>
  )
}

const arrowBtn = {
  background: "none",
  border: "none",
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
  opacity: 0.8,
  padding: "0 4px",
  lineHeight: 1,
  transition: "opacity 0.2s"
}