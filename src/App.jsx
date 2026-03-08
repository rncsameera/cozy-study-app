import { useState } from "react"
import Timer from "./components/Timer"
import Scene from "./components/Scene"
import Quotes from "./components/Quotes"

function App() {
  return (
    <div className="app">
      <Quotes />
      <Scene />
      <Timer />
    </div>
  )
}

export default App