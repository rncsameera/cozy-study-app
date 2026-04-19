import { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import StudyPage from "./pages/StudyPage"
import NotesPage from "./pages/NotesPage"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  if (loading) return (
    <div style={{
      height: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#0a0a0a", color: "white",
      fontSize: "14px", letterSpacing: "3px", opacity: 0.6
    }}>
      FOCUSDIVA...
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
      <Route path="/study" element={user ? <StudyPage user={user} /> : <Navigate to="/" />} />
      <Route path="/notes" element={user ? <NotesPage user={user} /> : <Navigate to="/" />} />
    </Routes>
  )
}

export default App