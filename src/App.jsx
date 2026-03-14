import { useState } from "react"
import Timer from "./components/Timer"
import Scene from "./components/Scene"
import Quotes from "./components/Quotes"
import TaskBoard from "./components/TaskBoard"
import SoundMixer from "./components/SoundMixer"

function App() {
  const [scenePreset, setScenePreset] = useState(null)

  return (
    <div className="app">
      <Quotes />
      <Scene onSceneChange={setScenePreset} />
      <Timer />
      <TaskBoard />
      <SoundMixer externalPreset={scenePreset} />
    </div>
  )
}

export default App