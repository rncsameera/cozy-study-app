import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../firebase"
import Timer from "../components/Timer"
import Scene from "../components/Scene"
import Quotes from "../components/Quotes"
import TaskBoard from "../components/TaskBoard"
import SoundMixer from "../components/SoundMixer"
import FocusMode from "../components/FocusMode"

export default function StudyPage({ user }) {
  const [scenePreset, setScenePreset] = useState(null)
  const [focusMode, setFocusMode]     = useState(false)
  const [currentScene, setCurrentScene] = useState({
    name: "Darjeeling", country: "West Bengal, India 🇮🇳"
  })
  const [focusTime, setFocusTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const navigate = useNavigate()

  const handleSceneChange = (preset, sceneInfo) => {
    setScenePreset(preset)
    if (sceneInfo) setCurrentScene(sceneInfo)
  }

  const saveNote = async (content) => {
    if (!content.trim()) return
    try {
      await addDoc(collection(db, "notes"), {
        userId: user.uid,
        content,
        scene: currentScene.name,
        createdAt: serverTimestamp()
      })
    } catch (err) {
      console.error("Failed to save note:", err)
    }
  }

  return (
    <div className="app">
      <Scene
        onSceneChange={handleSceneChange}
        focusMode={focusMode}
      />

      {!focusMode && (
        <>
          {/* Back to dashboard */}
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              position: "fixed", top: "20px", left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px", color: "rgba(255,255,255,0.5)",
              fontSize: "11px", padding: "6px 16px",
              cursor: "pointer", letterSpacing: "1px", zIndex: 10
            }}
          >
            ← DASHBOARD
          </button>
          <Quotes />
          <Timer
            onFocusStart={() => setFocusMode(true)}
            onTimerChange={(f, b) => { setFocusTime(f); setBreakTime(b) }}
          />
          <TaskBoard />
          <SoundMixer externalPreset={scenePreset} />
        </>
      )}

      {focusMode && (
        <FocusMode
          scene={currentScene}
          onExit={() => setFocusMode(false)}
          externalPreset={scenePreset}
          focusTime={focusTime}
          breakTime={breakTime}
          onSaveNote={saveNote}
        />
      )}
    </div>
  )
}