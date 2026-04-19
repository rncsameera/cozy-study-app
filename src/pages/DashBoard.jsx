import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"

export default function Dashboard({ user }) {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut(auth)
    navigate("/")
  }

  return (
    <div style={{
      height: "100vh", width: "100vw",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "Georgia, serif", color: "white"
    }}>
      {/* Header */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0,
        padding: "20px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        <h2 style={{ margin: 0, fontSize: "20px", letterSpacing: "2px" }}>
          Focus<span style={{ color: "rgba(100,255,150,0.9)" }}>Diva</span>
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "13px", opacity: 0.5 }}>
            {user.displayName || user.email}
          </span>
          <button onClick={handleSignOut} style={{
            padding: "6px 16px", borderRadius: "20px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white", fontSize: "12px", cursor: "pointer"
          }}>Sign Out</button>
        </div>
      </div>

      {/* Welcome */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <p style={{ fontSize: "13px", opacity: 0.4, letterSpacing: "3px", marginBottom: "12px" }}>
          WELCOME BACK
        </p>
        <h1 style={{ fontSize: "36px", fontWeight: "300", margin: 0 }}>
          {user.displayName ? user.displayName.split(" ")[0] : "Diva"} 👑
        </h1>
      </div>

      {/* Two cards */}
      <div style={{ display: "flex", gap: "24px" }}>
        {/* Study Card */}
        <div
          onClick={() => navigate("/study")}
          style={{
            width: "220px", height: "260px",
            background: "rgba(100,255,150,0.06)",
            border: "1px solid rgba(100,255,150,0.15)",
            borderRadius: "20px", padding: "32px 24px",
            cursor: "pointer", transition: "all 0.3s ease",
            display: "flex", flexDirection: "column",
            justifyContent: "space-between"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(100,255,150,0.12)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(100,255,150,0.06)"}
        >
          <span style={{ fontSize: "40px" }}>🎯</span>
          <div>
            <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "400" }}>
              Study Space
            </h3>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.5, lineHeight: "1.6" }}>
              Enter your cozy study environment with scenes, sounds and timer
            </p>
          </div>
          <span style={{ fontSize: "20px", opacity: 0.4 }}>→</span>
        </div>

        {/* Notes Card */}
        <div
          onClick={() => navigate("/notes")}
          style={{
            width: "220px", height: "260px",
            background: "rgba(100,150,255,0.06)",
            border: "1px solid rgba(100,150,255,0.15)",
            borderRadius: "20px", padding: "32px 24px",
            cursor: "pointer", transition: "all 0.3s ease",
            display: "flex", flexDirection: "column",
            justifyContent: "space-between"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(100,150,255,0.12)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(100,150,255,0.06)"}
        >
          <span style={{ fontSize: "40px" }}>📝</span>
          <div>
            <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "400" }}>
              My Notes
            </h3>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.5, lineHeight: "1.6" }}>
              Review quick notes from your focus sessions
            </p>
          </div>
          <span style={{ fontSize: "20px", opacity: 0.4 }}>→</span>
        </div>
      </div>
    </div>
  )
}