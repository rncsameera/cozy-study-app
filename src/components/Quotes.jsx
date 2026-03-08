function Quotes() {
  return (
    <div style={{
      position: "fixed",
      top: "30px",
      left: "50%",
      transform: "translateX(-50%)",
      color: "white",
      textAlign: "center",
      background: "rgba(0,0,0,0.3)",
      padding: "15px 30px",
      borderRadius: "15px",
      backdropFilter: "blur(10px)"
    }}>
      <p style={{ fontSize: "16px", fontStyle: "italic" }}>
        "The secret of getting ahead is getting started."
      </p>
    </div>
  )
}

export default Quotes