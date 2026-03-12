import { useState, useEffect, useRef } from "react"
import { Howl } from "howler"

import rainSrc from "../assets/sounds/rain.mp3"
import fireSrc from "../assets/sounds/fireplace.mp3"
import brownSrc from "../assets/sounds/brownnoise.mp3"
import forestSrc from "../assets/sounds/forest.mp3"
import cafeSrc from "../assets/sounds/cafe.mp3"
import whiteSrc from "../assets/sounds/whitenoise.mp3"

const SOUNDS = [
  { id: "rain",      label: "Rain",        emoji: "🌧️", src: rainSrc },
  { id: "fireplace", label: "Fireplace",   emoji: "🔥", src: fireSrc },
  { id: "brown",     label: "Brown Noise", emoji: "🌊", src: brownSrc },
  { id: "white",     label: "White Noise", emoji: "🌬️", src: whiteSrc },
  { id: "forest",    label: "Forest",      emoji: "🌿", src: forestSrc },
  { id: "cafe",      label: "Café",        emoji: "☕", src: cafeSrc },
]

const PRESETS = [
  { name: "Deep Focus",  config: { rain: 20, fireplace: 0,  brown: 70, white: 20, forest: 0,  cafe: 0  }},
  { name: "Cozy Study",  config: { rain: 50, fireplace: 30, brown: 0,  white: 0,  forest: 20, cafe: 0  }},
  { name: "Café Mode",   config: { rain: 20, fireplace: 0,  brown: 0,  white: 0,  forest: 0,  cafe: 70 }},
  { name: "Forest Flow", config: { rain: 0,  fireplace: 0,  brown: 30, white: 0,  forest: 70, cafe: 0  }},
  { name: "Night Owl",   config: { rain: 30, fireplace: 20, brown: 0,  white: 40, forest: 0,  cafe: 0  }},
  { name: "Silence",     config: { rain: 0,  fireplace: 0,  brown: 0,  white: 0,  forest: 0,  cafe: 0  }},
]

export default function SoundMixer() {
  const [volumes, setVolumes] = useState({
    rain: 0, fireplace: 0, brown: 0, white: 0, forest: 0, cafe: 0
  })
  const [isOpen, setIsOpen] = useState(true)
  const [activePreset, setActivePreset] = useState(null)
  const howls = useRef({})

  useEffect(() => {
    SOUNDS.forEach(s => {
      howls.current[s.id] = new Howl({
        src: [s.src],
        loop: true,
        volume: 0,
      })
    })
    return () => {
      Object.values(howls.current).forEach(h => h.unload())
    }
  }, [])

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

  const applyPreset = (preset) => {
    setVolumes(preset.config)
    setActivePreset(preset.name)
  }

  const handleSlider = (id, val) => {
    setVolumes(v => ({ ...v, [id]: Number(val) }))
    setActivePreset(null)
  }

  return (
    <div style={{
      position: "fixed",
      top: "30px",
      left: "30px",
      width: "230px",
      color: "white",
      zIndex: 10,
      fontFamily: "Georgia, serif"
    }}>
      {/* Header */}
      <div onClick={() => setIsOpen(!isOpen)} style={{
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
        padding: "12px 18px",
        borderRadius: isOpen ? "15px 15px 0 0" : "15px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: isOpen ? "1px solid rgba(255,255,255,0.1)" : "none"
      }}>
        <span style={{ fontSize: "13px", letterSpacing: "2px" }}>🎵 SOUNDSCAPE</span>
        <span style={{ fontSize: "12px", opacity: 0.6 }}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
    <div style={{
      background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(10px)",
      padding: "14px",
      borderRadius: "0 0 15px 15px",
      maxHeight: "75vh",
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "rgba(100,255,150,0.3) transparent"
    }}>

          {/* Presets */}
          <div style={{ marginBottom: "14px" }}>
            <p style={{ fontSize: "10px", letterSpacing: "1px", opacity: 0.5, marginBottom: "8px" }}>
              PRESETS
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {PRESETS.map(p => (
                <button key={p.name} onClick={() => applyPreset(p)} style={{
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: activePreset === p.name
                    ? "rgba(100,255,150,0.3)"
                    : "rgba(255,255,255,0.08)",
                  color: "white",
                  transition: "all 0.2s"
                }}>
                  {p.name === "Silence" ? "🔇 " : ""}{p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", marginBottom: "14px" }} />

          {/* Individual sliders */}
          <p style={{ fontSize: "10px", letterSpacing: "1px", opacity: 0.5, marginBottom: "10px" }}>
            CUSTOM MIX
          </p>
          {SOUNDS.map(s => (
            <div key={s.id} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{
                  fontSize: "12px",
                  opacity: volumes[s.id] > 0 ? 1 : 0.4,
                  transition: "opacity 0.2s"
                }}>
                  {s.emoji} {s.label}
                </span>
                <span style={{ fontSize: "11px", opacity: 0.5 }}>
                  {volumes[s.id]}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volumes[s.id]}
                onChange={e => handleSlider(s.id, e.target.value)}
                style={{ width: "100%", accentColor: "#64ff96", cursor: "pointer" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}