import { useState, useEffect } from "react"

function TaskBoard() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("stillspace-tasks")
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState("")
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    localStorage.setItem("stillspace-tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (input.trim() === "") return
    setTasks([...tasks, { id: Date.now(), text: input, done: false }])
    setInput("")
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask()
  }

  const completed = tasks.filter(t => t.done).length

  return (
    <div style={{
      position: "fixed",
      top: "30px",
      right: "30px",
      width: "280px",
      color: "white",
      zIndex: 10
    }}>
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
          padding: "12px 18px",
          borderRadius: isOpen ? "15px 15px 0 0" : "15px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: isOpen ? "1px solid rgba(255,255,255,0.1)" : "none"
        }}
      >
        <span style={{ fontSize: "14px", letterSpacing: "2px" }}>
          📋 TODAY'S GOALS
        </span>
        <span style={{ fontSize: "12px", opacity: 0.7 }}>
          {completed}/{tasks.length} {isOpen ? "▲" : "▼"}
        </span>
      </div>

      {/* Body */}
      {isOpen && (
        <div style={{
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(10px)",
          padding: "15px",
          borderRadius: "0 0 15px 15px"
        }}>

          {/* Progress bar */}
          {tasks.length > 0 && (
            <div style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              height: "4px",
              marginBottom: "12px"
            }}>
              <div style={{
                background: "rgba(100,255,150,0.7)",
                borderRadius: "10px",
                height: "4px",
                width: `${(completed / tasks.length) * 100}%`,
                transition: "width 0.3s ease"
              }} />
            </div>
          )}

          {/* Task list */}
          <div style={{ maxHeight: "250px", overflowY: "auto", marginBottom: "12px" }}>
            {tasks.length === 0 && (
              <p style={{ fontSize: "12px", opacity: 0.5, textAlign: "center", padding: "10px" }}>
                No tasks yet — add one below ✨
              </p>
            )}
            {tasks.map(task => (
              <div key={task.id} style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)"
              }}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  style={{ cursor: "pointer", accentColor: "#64ff96" }}
                />
                <span style={{
                  flex: 1,
                  fontSize: "13px",
                  textDecoration: task.done ? "line-through" : "none",
                  opacity: task.done ? 0.5 : 1,
                  transition: "all 0.2s"
                }}>
                  {task.text}
                </span>
                <span
                  onClick={() => deleteTask(task.id)}
                  style={{ cursor: "pointer", opacity: 0.4, fontSize: "12px" }}
                >
                  ✕
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a task..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "white",
                fontSize: "13px",
                outline: "none"
              }}
            />
            <button
              onClick={addTask}
              style={{
                background: "rgba(100,255,150,0.3)",
                border: "1px solid rgba(100,255,150,0.4)",
                borderRadius: "8px",
                color: "white",
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskBoard