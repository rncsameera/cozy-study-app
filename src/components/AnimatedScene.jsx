import { useEffect, useRef } from "react"

// ── Rain Scene (Darjeeling) ──────────────────────────────────────────────
function RainScene() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: -1,
      background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f2027 100%)"
    }}>
      <style>{`
        @keyframes rainFall {
          0% { transform: translateY(-100px) translateX(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(110vh) translateX(20px); opacity: 0; }
        }
        @keyframes mistFloat {
          0% { transform: translateX(-100px); opacity: 0; }
          50% { opacity: 0.15; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
        @keyframes lightningFlash {
          0%, 95%, 100% { opacity: 0; }
          96%, 99% { opacity: 0.03; }
        }
      `}</style>

      {/* Lightning flash overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "white",
        animation: "lightningFlash 8s infinite",
        pointerEvents: "none"
      }} />

      {/* Mist layers */}
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: "600px", height: "200px",
          background: "rgba(200,220,255,0.06)",
          borderRadius: "50%",
          top: `${20 + i * 25}%`,
          filter: "blur(40px)",
          animation: `mistFloat ${18 + i * 6}s linear infinite`,
          animationDelay: `${i * 5}s`
        }} />
      ))}

      {/* Rain drops */}
      {[...Array(80)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 100}px`,
          width: "1px",
          height: `${8 + Math.random() * 15}px`,
          background: `rgba(174,214,241,${0.3 + Math.random() * 0.4})`,
          animation: `rainFall ${0.8 + Math.random() * 0.8}s linear infinite`,
          animationDelay: `${Math.random() * 2}s`,
          borderRadius: "2px"
        }} />
      ))}

      {/* Ground glow */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "30vh",
        background: "linear-gradient(0deg, rgba(15,32,39,0.9) 0%, transparent 100%)"
      }} />

      {/* Distant mountains silhouette */}
      <svg viewBox="0 0 1440 320" style={{
        position: "absolute", bottom: 0, width: "100%",
        opacity: 0.4
      }}>
        <path fill="#0a0e1a" d="M0,160 C200,80 400,240 600,120 C800,0 1000,180 1200,100 C1350,40 1400,120 1440,100 L1440,320 L0,320 Z"/>
        <path fill="#080c18" d="M0,220 C150,160 350,280 550,200 C750,120 950,240 1150,180 C1300,130 1400,200 1440,180 L1440,320 L0,320 Z"/>
      </svg>
    </div>
  )
}

// ── Snow Scene (Manali) ──────────────────────────────────────────────────
function SnowScene() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: -1,
      background: "linear-gradient(180deg, #0d1b2a 0%, #1b2838 40%, #1a1a2e 100%)"
    }}>
      <style>{`
        @keyframes snowFall {
          0% { transform: translateY(-20px) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(105vh) translateX(30px) rotate(360deg); opacity: 0; }
        }
        @keyframes snowDrift {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(15px); }
        }
      `}</style>

      {/* Snow flakes */}
      {[...Array(60)].map((_, i) => {
        const size = 2 + Math.random() * 4
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            background: `rgba(255,255,255,${0.5 + Math.random() * 0.5})`,
            animation: `snowFall ${3 + Math.random() * 4}s linear infinite, snowDrift ${2 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            filter: "blur(0.5px)"
          }} />
        )
      })}

      {/* Mountain silhouettes */}
      <svg viewBox="0 0 1440 400" style={{
        position: "absolute", bottom: 0, width: "100%"
      }}>
        <path fill="#0a1628" d="M0,300 L200,100 L400,250 L600,50 L800,200 L1000,80 L1200,220 L1440,120 L1440,400 L0,400 Z"/>
        <path fill="rgba(255,255,255,0.08)" d="M0,300 L200,100 L250,130 L200,120 L400,250 L450,230 L600,50 L650,90 L800,200 L850,185 L1000,80 L1050,110 L1200,220 L1440,120 L1440,140 L1200,240 L1000,100 L800,220 L600,70 L400,270 L200,140 L0,320 Z"/>
      </svg>

      {/* Snow ground */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "20vh",
        background: "linear-gradient(0deg, rgba(200,220,255,0.08) 0%, transparent 100%)"
      }} />
    </div>
  )
}

// ── Mist Scene (Munnar) ──────────────────────────────────────────────────
function MistScene() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: -1,
      background: "linear-gradient(180deg, #1a2f1a 0%, #1f3a1f 40%, #0f2010 100%)"
    }}>
      <style>{`
        @keyframes mistMove {
          0% { transform: translateX(-200px) scaleY(1); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 0.8; }
          100% { transform: translateX(110vw) scaleY(1.2); opacity: 0; }
        }
        @keyframes leafSway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>

      {/* Mist layers */}
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${400 + i * 100}px`,
          height: `${80 + i * 30}px`,
          background: `rgba(200,240,200,${0.04 + i * 0.01})`,
          borderRadius: "50%",
          top: `${15 + i * 15}%`,
          filter: `blur(${30 + i * 10}px)`,
          animation: `mistMove ${20 + i * 8}s linear infinite`,
          animationDelay: `${i * 4}s`
        }} />
      ))}

      {/* Tea garden hills silhouette */}
      <svg viewBox="0 0 1440 350" style={{
        position: "absolute", bottom: 0, width: "100%"
      }}>
        <path fill="#0d1f0d"
          d="M0,200 C100,150 150,180 200,160 C250,140 280,170 320,155 C360,140 400,165 440,150 C520,120 560,160 620,140 C680,120 720,155 780,135 C840,115 880,150 940,130 C1000,110 1060,145 1120,125 C1180,105 1240,140 1300,120 C1360,100 1400,135 1440,115 L1440,350 L0,350 Z"/>
        <path fill="#0a1a0a"
          d="M0,250 C80,220 140,240 200,225 C280,205 320,230 400,215 C480,200 520,225 600,210 C680,195 740,220 820,205 C900,190 960,215 1040,200 C1120,185 1180,210 1260,195 C1340,180 1400,205 1440,190 L1440,350 L0,350 Z"/>
      </svg>

      {/* Green overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(20,60,20,0.3)"
      }} />
    </div>
  )
}

// ── Firefly Scene (Coorg) ────────────────────────────────────────────────
function FireflyScene() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: -1,
      background: "linear-gradient(180deg, #0a0f0a 0%, #1a2510 40%, #0f1a08 100%)"
    }}>
      <style>{`
        @keyframes fireflyFloat {
          0% { transform: translate(0px, 0px); opacity: 0; }
          25% { opacity: 1; }
          50% { transform: translate(30px, -20px); opacity: 0.8; }
          75% { opacity: 0.3; }
          100% { transform: translate(-10px, 10px); opacity: 0; }
        }
        @keyframes fireflyGlow {
          0%, 100% { box-shadow: 0 0 4px 2px rgba(180,255,100,0.6); }
          50% { box-shadow: 0 0 8px 4px rgba(180,255,100,0.9); }
        }
      `}</style>

      {/* Fireflies */}
      {[...Array(30)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${10 + Math.random() * 80}%`,
          top: `${20 + Math.random() * 60}%`,
          width: "3px", height: "3px",
          borderRadius: "50%",
          background: "rgba(180,255,100,0.9)",
          animation: `fireflyFloat ${4 + Math.random() * 6}s ease-in-out infinite, fireflyGlow ${1 + Math.random()}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`
        }} />
      ))}

      {/* Forest silhouette */}
      <svg viewBox="0 0 1440 400" style={{
        position: "absolute", bottom: 0, width: "100%"
      }}>
        {/* Trees */}
        {[...Array(20)].map((_, i) => {
          const x = i * 75
          const h = 80 + Math.random() * 120
          return (
            <g key={i}>
              <polygon
                points={`${x},${350} ${x + 35},${350 - h} ${x + 70},${350}`}
                fill={i % 2 === 0 ? "#0a150a" : "#080f08"}
              />
            </g>
          )
        })}
        <rect x="0" y="330" width="1440" height="70" fill="#060c06"/>
      </svg>
    </div>
  )
}

// ── Chicago Snow Scene ───────────────────────────────────────────────────
function CitySnowScene() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: -1,
      background: "linear-gradient(180deg, #0a0a14 0%, #141428 40%, #0a0a1e 100%)"
    }}>
      <style>{`
        @keyframes citySnow {
          0% { transform: translateY(-10px) translateX(0px); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(105vh) translateX(10px); opacity: 0; }
        }
        @keyframes windowGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* City buildings silhouette */}
      <svg viewBox="0 0 1440 400" style={{
        position: "absolute", bottom: 0, width: "100%"
      }}>
        {/* Buildings */}
        <rect x="0"    y="200" width="80"  height="200" fill="#0d0d1f"/>
        <rect x="20"   y="150" width="40"  height="250" fill="#111128"/>
        <rect x="90"   y="180" width="60"  height="220" fill="#0d0d1f"/>
        <rect x="160"  y="120" width="50"  height="280" fill="#111128"/>
        <rect x="220"  y="160" width="70"  height="240" fill="#0a0a1e"/>
        <rect x="300"  y="100" width="45"  height="300" fill="#111128"/>
        <rect x="355"  y="140" width="65"  height="260" fill="#0d0d1f"/>
        <rect x="430"  y="170" width="55"  height="230" fill="#111128"/>
        <rect x="495"  y="90"  width="80"  height="310" fill="#0a0a1e"/>
        <rect x="585"  y="130" width="50"  height="270" fill="#111128"/>
        <rect x="645"  y="160" width="70"  height="240" fill="#0d0d1f"/>
        <rect x="725"  y="110" width="60"  height="290" fill="#111128"/>
        <rect x="795"  y="150" width="45"  height="250" fill="#0a0a1e"/>
        <rect x="850"  y="80"  width="75"  height="320" fill="#111128"/>
        <rect x="935"  y="130" width="55"  height="270" fill="#0d0d1f"/>
        <rect x="1000" y="160" width="65"  height="240" fill="#111128"/>
        <rect x="1075" y="100" width="50"  height="300" fill="#0a0a1e"/>
        <rect x="1135" y="140" width="80"  height="260" fill="#111128"/>
        <rect x="1225" y="170" width="60"  height="230" fill="#0d0d1f"/>
        <rect x="1295" y="120" width="70"  height="280" fill="#111128"/>
        <rect x="1375" y="150" width="65"  height="250" fill="#0a0a1e"/>

        {/* Windows */}
        {[...Array(60)].map((_, i) => (
          <rect key={i}
            x={20 + (i % 20) * 72}
            y={120 + Math.floor(i / 20) * 60}
            width="6" height="8"
            fill={`rgba(255,220,100,${0.3 + Math.random() * 0.5})`}
            style={{ animation: `windowGlow ${2 + Math.random() * 3}s ease-in-out infinite` }}
          />
        ))}

        {/* Ground snow */}
        <rect x="0" y="370" width="1440" height="30" fill="rgba(200,220,255,0.15)"/>
      </svg>

      {/* Snow */}
      {[...Array(70)].map((_, i) => {
        const size = 1.5 + Math.random() * 3
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: "-10px",
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            background: `rgba(255,255,255,${0.6 + Math.random() * 0.4})`,
            animation: `citySnow ${3 + Math.random() * 4}s linear infinite`,
            animationDelay: `${Math.random() * 4}s`
          }} />
        )
      })}

      {/* City glow at bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "40vh",
        background: "linear-gradient(0deg, rgba(20,20,60,0.6) 0%, transparent 100%)"
      }} />
    </div>
  )
}

// ── Main Export ──────────────────────────────────────────────────────────
const SCENE_COMPONENTS = {
  darjeeling: RainScene,
  munnar: MistScene,
  manali: SnowScene,
  coorg: FireflyScene,
  "chicago-snow": CitySnowScene,
}

export default function AnimatedScene({ sceneId }) {
  const SceneComponent = SCENE_COMPONENTS[sceneId] || RainScene
  return <SceneComponent />
}