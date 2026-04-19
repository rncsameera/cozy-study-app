import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth"
import { auth } from "../firebase"

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail]           = useState("")
  const [password, setPassword]     = useState("")
  const [error, setError]           = useState("")
  const [loading, setLoading]       = useState(false)
  const navigate                    = useNavigate()

  const handleEmailAuth = async () => {
    if (!email || !password) return setError("Please fill in all fields")
    setLoading(true)
    setError("")
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      navigate("/dashboard")
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(.*\)/, ""))
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError("")
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      height: "100vh", width: "100vw",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Georgia, serif"
    }}>
      {/* Background blur circles */}
      <div style={{
        position: "absolute", width: "400px", height: "400px",
        background: "rgba(100,255,150,0.03)", borderRadius: "50%",
        top: "10%", left: "20%", filter: "blur(80px)"
      }} />
      <div style={{
        position: "absolute", width: "300px", height: "300px",
        background: "rgba(100,150,255,0.04)", borderRadius: "50%",
        bottom: "20%", right: "15%", filter: "blur(60px)"
      }} />

      {/* Login Card */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        padding: "48px 40px",
        width: "380px",
        textAlign: "center",
        position: "relative"
      }}>
        {/* Logo */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{
            fontSize: "32px", fontWeight: "700",
            color: "white", margin: "0 0 8px",
            letterSpacing: "2px"
          }}>
            Focus<span style={{ color: "rgba(100,255,150,0.9)" }}>Diva</span>
          </h1>
          <p style={{ fontSize: "12px", opacity: 0.4, color: "white", letterSpacing: "2px" }}>
            YOUR COZY STUDY SPACE
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: "flex", background: "rgba(255,255,255,0.05)",
          borderRadius: "12px", padding: "4px", marginBottom: "24px"
        }}>
          <button onClick={() => setIsRegister(false)} style={{
            flex: 1, padding: "8px", borderRadius: "8px", border: "none",
            background: !isRegister ? "rgba(255,255,255,0.1)" : "transparent",
            color: "white", fontSize: "12px", cursor: "pointer",
            letterSpacing: "1px"
          }}>SIGN IN</button>
          <button onClick={() => setIsRegister(true)} style={{
            flex: 1, padding: "8px", borderRadius: "8px", border: "none",
            background: isRegister ? "rgba(255,255,255,0.1)" : "transparent",
            color: "white", fontSize: "12px", cursor: "pointer",
            letterSpacing: "1px"
          }}>REGISTER</button>
        </div>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: "100%", padding: "12px 16px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px", color: "white",
            fontSize: "14px", outline: "none",
            marginBottom: "12px", boxSizing: "border-box",
            fontFamily: "Georgia, serif"
          }}
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleEmailAuth()}
          style={{
            width: "100%", padding: "12px 16px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px", color: "white",
            fontSize: "14px", outline: "none",
            marginBottom: "16px", boxSizing: "border-box",
            fontFamily: "Georgia, serif"
          }}
        />

        {/* Error */}
        {error && (
          <p style={{ color: "rgba(255,100,100,0.8)", fontSize: "12px", marginBottom: "12px" }}>
            {error}
          </p>
        )}

        {/* Submit button */}
        <button onClick={handleEmailAuth} disabled={loading} style={{
          width: "100%", padding: "12px",
          background: "rgba(100,255,150,0.2)",
          border: "1px solid rgba(100,255,150,0.3)",
          borderRadius: "12px", color: "white",
          fontSize: "13px", cursor: "pointer",
          letterSpacing: "1px", marginBottom: "16px",
          opacity: loading ? 0.6 : 1
        }}>
          {loading ? "..." : isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
        </button>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: "12px", marginBottom: "16px"
        }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Google button */}
        <button onClick={handleGoogle} disabled={loading} style={{
          width: "100%", padding: "12px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px", color: "white",
          fontSize: "13px", cursor: "pointer",
          letterSpacing: "1px", display: "flex",
          alignItems: "center", justifyContent: "center", gap: "10px"
        }}>
          <svg width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          CONTINUE WITH GOOGLE
        </button>
      </div>
    </div>
  )
}