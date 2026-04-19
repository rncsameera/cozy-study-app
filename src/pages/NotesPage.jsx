import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "../firebase"

export default function NotesPage({ user }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const q = query(
        collection(db, "notes"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      )
      const snapshot = await getDocs(q)
      setNotes(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id))
    setNotes(notes.filter(n => n.id !== id))
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ""
    const d = timestamp.toDate()
    return d.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })
  }

  return (
    <div style={{
      minHeight: "100vh", width: "100vw",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
      fontFamily: "Georgia, serif", color: "white"
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        <button onClick={() => navigate("/dashboard")} style={{
          background: "none", border: "none", color: "rgba(255,255,255,0.5)",
          fontSize: "14px", cursor: "pointer", letterSpacing: "1px"
        }}>← Back</button>
        <h2 style={{ margin: 0, fontSize: "16px", letterSpacing: "3px", opacity: 0.8 }}>
          MY NOTES
        </h2>
        <div style={{ width: "60px" }} />
      </div>

      {/* Content */}
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 20px" }}>
        {loading && (
          <p style={{ textAlign: "center", opacity: 0.4, letterSpacing: "2px" }}>
            LOADING...
          </p>
        )}

        {!loading && notes.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "80px" }}>
            <p style={{ fontSize: "40px", marginBottom: "16px" }}>📝</p>
            <p style={{ opacity: 0.4, fontSize: "14px", letterSpacing: "1px" }}>
              No notes yet — start a focus session and jot something down!
            </p>
            <button onClick={() => navigate("/study")} style={{
              marginTop: "24px", padding: "10px 24px",
              background: "rgba(100,255,150,0.15)",
              border: "1px solid rgba(100,255,150,0.3)",
              borderRadius: "20px", color: "white",
              fontSize: "13px", cursor: "pointer"
            }}>Start Studying →</button>
          </div>
        )}

        {notes.map(note => (
          <div key={note.id} style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", padding: "20px 24px",
            marginBottom: "16px"
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", marginBottom: "12px"
            }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", opacity: 0.4 }}>
                  🗓 {formatDate(note.createdAt)}
                </span>
                {note.scene && (
                  <span style={{
                    fontSize: "11px", opacity: 0.5,
                    background: "rgba(255,255,255,0.06)",
                    padding: "2px 8px", borderRadius: "10px"
                  }}>
                    📍 {note.scene}
                  </span>
                )}
              </div>
              <button onClick={() => deleteNote(note.id)} style={{
                background: "none", border: "none",
                color: "rgba(255,100,100,0.5)", cursor: "pointer",
                fontSize: "14px"
              }}>✕</button>
            </div>
            <p style={{
              margin: 0, fontSize: "14px", lineHeight: "1.7",
              opacity: 0.85, whiteSpace: "pre-wrap"
            }}>
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}