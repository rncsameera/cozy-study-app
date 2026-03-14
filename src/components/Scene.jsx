import { useState } from "react"
import darjeeling from "../assets/scenes/Darjeeling.jpg"
import munnar from "../assets/scenes/munnar.jpg"
import manali from "../assets/scenes/manali.jpg"
import coorg from "../assets/scenes/coorg.jpg"

const SCENES = [
  {
    id: "darjeeling",
    name: "Darjeeling",
    label: "🚂 Darjeeling",
    img: darjeeling,
    soundPreset: { rain: 30, fireplace: 0, brown: 0, white: 0, forest: 20, cafe: 0 }
  },
  {
    id: "munnar",
    name: "Munnar",
    label: "🌿 Munnar",
    img: munnar,
    soundPreset: { rain: 40, fireplace: 0, brown: 20, white: 0, forest: 40, cafe: 0 }
  },
  {
    id: "manali",
    name: "Manali",
    label: "🏔️ Manali",
    img: manali,
    soundPreset: { rain: 0, fireplace: 30, brown: 50, white: 20, forest: 0, cafe: 0 }
  },
  {
    id: "coorg",
    name: "Coorg",
    label: "☕ Coorg",
    img: coorg,
    soundPreset: { rain: 20, fireplace: 20, brown: 0, white: 0, forest: 30, cafe: 30 }
  },
]

export default function Scene({ onSceneChange }) {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  const switchScene = (index) => {
    if (index === current) return
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
      if (onSceneChange) onSceneChange(SCENES[index].soundPreset)
    }, 400)
  }

  return (
    <>
      {/* Background Image */}
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        zIndex: -1,
        transition: "opacity 0.4s ease",
        opacity: fading ? 0 : 1
      }}>
        <img
          src={SCENES[current].img}
          alt={SCENES[current].name}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            filter: "brightness(0.55)"
          }}
        />
      </div>

      {/* Scene Switcher Bar */}
      <div style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        zIndex: 10
      }}>
        {SCENES.map((scene, i) => (
          <button
            key={scene.id}
            onClick={() => switchScene(i)}
            style={{
              padding: "8px 14px",
              borderRadius: "12px",
              fontSize: "12px",
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.2)",
              background: current === i
                ? "rgba(255,255,255,0.25)"
                : "rgba(0,0,0,0.35)",
              color: "white",
              backdropFilter: "blur(8px)",
              textAlign: "left",
              transition: "all 0.2s",
              fontWeight: current === i ? "600" : "400",
              letterSpacing: "0.5px"
            }}
          >
            {scene.label}
          </button>
        ))}
      </div>
    </>
  )
}