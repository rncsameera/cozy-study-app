import { useState, useEffect } from "react"
import darjeeling from "../assets/scenes/Darjeeling.jpg"
import munnar from "../assets/scenes/munnar.jpg"
import manali from "../assets/scenes/manali.jpg"
import coorg from "../assets/scenes/coorg.jpg"
import chicagoSnow from "../assets/scenes/chicago_snow.mp4"
const SCENES = [
  {
    id: "darjeeling",
    name: "Darjeeling",
    country: "West Bengal, India 🇮🇳",
    type: "image",
    src: darjeeling,
    filter: "brightness(0.55)",
  },
  {
    id: "munnar",
    name: "Munnar",
    country: "Kerala, India 🇮🇳",
    type: "image",
    src: munnar,
    filter: "brightness(0.55)",
  },
  {
    id: "manali",
    name: "Manali",
    country: "Himachal Pradesh, India 🇮🇳",
    type: "image",
    src: manali,
    filter: "brightness(0.55)",
  },
  {
    id: "coorg",
    name: "Coorg",
    country: "Karnataka, India 🇮🇳",
    type: "image",
    src: coorg,
    filter: "brightness(0.55)",
  },
  {
    id: "chicago-snow",
    name: "Chicago Snow",
    country: "Illinois, USA 🇺🇸",
    type: "video",
    src: chicagoSnow,
    filter: "brightness(0.6) saturate(1.4) hue-rotate(10deg)",
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

  const scene = SCENES[current]

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
        {scene.type === "image" ? (
  <img
    src={scene.src}
    alt={scene.name}
    style={{
      width: "100%", height: "100%",
      objectFit: "cover",
      filter: scene.filter
    }}
  />
) : (
  <video
    src={scene.src}
    autoPlay loop muted playsInline
    style={{
      width: "100%", height: "100%",
      objectFit: "cover",
      filter: scene.filter,
      imageRendering: "high-quality",
      transform: "translateZ(0)",
      willChange: "transform"
    }}
  />
)}
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