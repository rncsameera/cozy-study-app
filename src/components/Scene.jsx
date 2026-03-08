import darjeeling from "../assets/scenes/Darjeeling.jpg"

function Scene() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: -1
    }}>
      <img
        src={darjeeling}
        alt="Darjeeling Train View"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.6)"
        }}
      />
    </div>
  )
}

export default Scene