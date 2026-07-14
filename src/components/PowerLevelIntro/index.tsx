"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Phase = "scanning" | "analyzing" | "charging" | "overflow" | "flash";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; life: number;
  hue: number;
}

export default function PowerLevelIntro({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("scanning");
  const [scanY, setScanY] = useState(0);
  const [showTarget, setShowTarget] = useState(false);
  const [showPower, setShowPower] = useState(false);
  const [powerLevel, setPowerLevel] = useState(0);
  const [overflow, setOverflow] = useState(false);
  const [flash, setFlash] = useState(0);

  const complete = useCallback(() => {
    sessionStorage.setItem("portfolio-intro-seen", "1");
    onComplete();
  }, [onComplete]);

  // Canvas background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d")!;
    const particles: Particle[] = [];
    let frame = 0;
    let rafId: number;

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      if (frame % 4 === 0) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 5,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(0.8 + Math.random() * 2.5),
          size: 1 + Math.random() * 2.5,
          life: 80 + Math.random() * 80,
          hue: 180 + Math.random() * 80,
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0 || p.y < -10) { particles.splice(i, 1); continue; }

        const alpha = Math.min(p.life / 80, 1) * 0.7;
        const color = `hsl(${p.hue}, 100%, 65%)`;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Phase sequence
  useEffect(() => {
    if (sessionStorage.getItem("portfolio-intro-seen")) {
      onComplete();
      return;
    }

    let scanRafId: number;
    const scanStart = Date.now();

    const animateScan = () => {
      const progress = ((Date.now() - scanStart) % 1200) / 1200;
      setScanY(progress * 100);
      scanRafId = requestAnimationFrame(animateScan);
    };
    animateScan();

    // 1.5s: show target
    const t1 = setTimeout(() => {
      setPhase("analyzing");
      setShowTarget(true);
    }, 1500);

    // 2.8s: start charging
    const t2 = setTimeout(() => {
      cancelAnimationFrame(scanRafId);
      setPhase("charging");
      setShowPower(true);

      const start = Date.now();
      const duration = 3200;
      let chargeRafId: number;

      const charge = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 0.8) {
          // Normal acceleration
          const eased = Math.pow(progress / 0.8, 0.55);
          setPowerLevel(Math.floor(eased * 8200));
        } else if (progress < 0.95) {
          // Frantic overflow approach — random flashing
          setPowerLevel(8200 + Math.floor(Math.random() * 1200));
        } else {
          // Pinned to 9001
          setPowerLevel(9001);
        }

        if (progress < 1) {
          chargeRafId = requestAnimationFrame(charge);
        } else {
          // Overflow
          setPhase("overflow");
          setOverflow(true);

          const t3 = setTimeout(() => {
            setPhase("flash");
            let f = 0;
            const flashInterval = setInterval(() => {
              f = Math.min(f + 0.12, 1);
              setFlash(f);
              if (f >= 1) {
                clearInterval(flashInterval);
                setTimeout(complete, 120);
              }
            }, 25);
          }, 1400);

          return () => clearTimeout(t3);
        }
        return undefined;
      };
      charge();

      return () => cancelAnimationFrame(chargeRafId);
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(scanRafId);
    };
  }, [complete, onComplete]);

  const isShaking = phase === "overflow";
  const scanLine = phase === "scanning";

  const powerColor = overflow
    ? "#ffffff"
    : powerLevel > 6000
    ? `hsl(${210 - (powerLevel / 9001) * 50}, 100%, ${60 + (powerLevel / 9001) * 30}%)`
    : "#58a6ff";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99998,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        animation: isShaking ? "ki-shake 0.08s infinite" : "none",
        fontFamily: "var(--font-geist-mono, monospace)",
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />

      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,255,200,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,200,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* Scan line */}
      {scanLine && (
        <div
          style={{
            position: "absolute",
            top: `${scanY}%`,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent 0%, #00ffcc 20%, #00ffcc 80%, transparent 100%)",
            boxShadow: "0 0 24px #00ffcc, 0 0 48px rgba(0,255,200,0.4)",
            pointerEvents: "none",
            transition: "none",
          }}
        />
      )}

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "0 2rem",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        {/* Header */}
        <p
          style={{
            color: "#00ffcc",
            fontSize: "0.6875rem",
            letterSpacing: "0.35em",
            marginBottom: "2.5rem",
            opacity: 0.9,
            textTransform: "uppercase",
          }}
        >
          ◈ SCOUTER SYSTEMS ONLINE ◈
        </p>

        {/* Target analysis */}
        {showTarget && (
          <div
            style={{ marginBottom: "2.5rem", animation: "ki-fadeUp 0.6s ease-out forwards" }}
          >
            <p
              style={{
                color: "#00ffcc",
                fontSize: "0.6875rem",
                letterSpacing: "0.2em",
                marginBottom: "1rem",
                opacity: 0.8,
              }}
            >
              {`>> ANALYZING TARGET`}
            </p>
            <p
              style={{
                color: "#e6edf3",
                fontSize: "clamp(1.75rem, 7vw, 3rem)",
                fontWeight: 900,
                letterSpacing: "0.12em",
                marginBottom: "0.5rem",
                lineHeight: 1,
              }}
            >
              R. JOHN VICTOR
            </p>
            <p style={{ color: "#58a6ff", fontSize: "0.9375rem", letterSpacing: "0.2em" }}>
              FULL STACK ENGINEER
            </p>
          </div>
        )}

        {/* Power level */}
        {showPower && (
          <div style={{ animation: "ki-fadeUp 0.4s ease-out forwards" }}>
            <p
              style={{
                color: "#484f58",
                fontSize: "0.6875rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              POWER LEVEL
            </p>

            {/* Progress bar */}
            <div
              style={{
                width: "100%",
                height: "3px",
                background: "#161b22",
                borderRadius: "2px",
                marginBottom: "1rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min((powerLevel / 9001) * 100, 100)}%`,
                  background: `linear-gradient(90deg, #1d4ed8, ${powerColor})`,
                  boxShadow: `0 0 8px ${powerColor}`,
                  transition: overflow ? "none" : "width 0.05s",
                }}
              />
            </div>

            <p
              style={{
                fontSize: "clamp(3.5rem, 14vw, 7rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: powerColor,
                textShadow: overflow
                  ? `0 0 30px #fff, 0 0 60px #58a6ff, 0 0 100px #58a6ff`
                  : `0 0 20px ${powerColor}, 0 0 40px rgba(88,166,255,0.4)`,
                transition: "color 0.08s, text-shadow 0.08s",
              }}
            >
              {overflow ? "9,001+" : powerLevel.toLocaleString()}
            </p>

            {overflow && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "clamp(0.875rem, 3vw, 1.25rem)",
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  marginTop: "1.25rem",
                  animation: "ki-flicker 0.12s infinite",
                  textShadow: "0 0 12px #ef4444",
                }}
              >
                !!! READING OVERFLOW !!!
              </p>
            )}
          </div>
        )}

        {/* Initial scanning */}
        {phase === "scanning" && !showTarget && (
          <p
            style={{
              color: "#00ffcc",
              fontSize: "1rem",
              letterSpacing: "0.25em",
              animation: "ki-blink 1s infinite",
            }}
          >
            SCANNING...
          </p>
        )}
      </div>

      {/* White flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          opacity: flash,
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes ki-shake {
          0%   { transform: translate(0,0) rotate(0deg); }
          20%  { transform: translate(-5px, 3px) rotate(-0.5deg); }
          40%  { transform: translate(5px, -3px) rotate(0.5deg); }
          60%  { transform: translate(-3px, 5px) rotate(-0.3deg); }
          80%  { transform: translate(3px, -5px) rotate(0.3deg); }
          100% { transform: translate(0,0) rotate(0deg); }
        }
        @keyframes ki-fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ki-flicker {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        @keyframes ki-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
