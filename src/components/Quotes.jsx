import { useState, useEffect } from "react"

const FALLBACK_QUOTES = [
  { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { content: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { content: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { content: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { content: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { content: "Small progress is still progress.", author: "Unknown" },
  { content: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { content: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
]

export default function Quotes() {
  const [quote, setQuote] = useState(FALLBACK_QUOTES[0])
  const [visible, setVisible] = useState(true)

  const fetchQuote = async () => {
    try {
      const res = await fetch("https://api.quotable.io/random?tags=inspirational,success,education")
      const data = await res.json()
      if (data.content) {
        setQuote({ content: data.content, author: data.author })
      } else {
        throw new Error("no content")
      }
    } catch {
      // API failed, use fallback
      const random = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
      setQuote(random)
    }
  }

  const changeQuote = async () => {
    // Fade out
    setVisible(false)
    setTimeout(async () => {
      await fetchQuote()
      // Fade in
      setVisible(true)
    }, 400)
  }

  // Fetch on first load
  useEffect(() => {
    fetchQuote()
  }, [])

  // Auto change every 5 minutes
  useEffect(() => {
    const interval = setInterval(changeQuote, 10 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      position: "fixed",
      top: "30px",
      left: "50%",
      transform: "translateX(-50%)",
      color: "white",
      textAlign: "center",
      background: "rgba(0,0,0,0.35)",
      padding: "14px 28px",
      borderRadius: "15px",
      backdropFilter: "blur(10px)",
      zIndex: 10,
      maxWidth: "500px",
      width: "90%",
      transition: "opacity 0.4s ease",
      opacity: visible ? 1 : 0,
      cursor: "pointer"
    }}
    onClick={changeQuote}
    title="Click for new quote"
    >
      <p style={{ fontSize: "14px", fontStyle: "italic", marginBottom: "6px", lineHeight: "1.5" }}>
        "{quote.content}"
      </p>
      <p style={{ fontSize: "11px", opacity: 0.6, letterSpacing: "1px" }}>
        — {quote.author}
      </p>
    </div>
  )
}