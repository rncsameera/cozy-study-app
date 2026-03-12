import { useState } from "react"
import Timer from "./components/Timer"
import Scene from "./components/Scene"
import Quotes from "./components/Quotes"
import TaskBoard from "./components/TaskBoard"

function App() {
  return (
    <div className="app">
      <Quotes />
      <Scene />
      <Timer />
      <TaskBoard />
    </div>
  )
}

export default App