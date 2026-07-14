"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; hue: number;
}

interface BlastRing {
  x: number; y: number;
  r: number; maxR: number;
}

export default function KiCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (theme !== "power") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d")!;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isHover = false;
    const particles: Particle[] = [];
    const blasts: BlastRing[] = [];
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isHover = !!(e.target as HTMLElement)?.closest?.("a, button, [role='button']");
    };

    const onClick = (e: MouseEvent) => {
      blasts.push({ x: e.clientX, y: e.clientY, r: 0, maxR: 90 });
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const spd = 2 + Math.random() * 4;
        particles.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
          life: 35, maxLife: 35,
          size: 2 + Math.random() * 3,
          hue: isHover ? 40 + Math.random() * 25 : 270 + Math.random() * 50,
        });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);

    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Spawn trail particles
      if (frame % 2 === 0) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (isHover ? 12 : 7);
        particles.push({
          x: mouseX + Math.cos(angle) * dist,
          y: mouseY + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.3,
          life: 18 + Math.random() * 22,
          maxLife: 40,
          size: 1 + Math.random() * 2.5,
          hue: isHover ? 40 + Math.random() * 30 : 270 + Math.random() * 60,
        });
      }

      // Draw trail particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        const alpha = (p.life / p.maxLife) * 0.85;
        const color = `hsl(${p.hue}, 100%, 70%)`;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = color; ctx.shadowBlur = 8;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw blast rings
      for (let i = blasts.length - 1; i >= 0; i--) {
        const b = blasts[i];
        b.r += 5;
        if (b.r >= b.maxR) { blasts.splice(i, 1); continue; }
        const alpha = 1 - b.r / b.maxR;
        ctx.save();
        ctx.globalAlpha = alpha * 0.9;
        ctx.strokeStyle = isHover ? "#fde68a" : "#bf5fff";
        ctx.shadowColor  = isHover ? "#f59e0b" : "#bf5fff";
        ctx.shadowBlur = 18; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Ki ball
      const baseR = isHover ? 15 : 10;
      const pulse = baseR + Math.sin(frame * 0.12) * 2.5;

      // Glow layers
      [[3.5, 0.07], [2, 0.18]].forEach(([mult, alpha]) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = isHover ? "#f59e0b" : "#bf5fff";
        ctx.shadowBlur = 40;
        ctx.fillStyle = isHover ? "#f59e0b" : "#bf5fff";
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, pulse * mult, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Core gradient
      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.9)"; ctx.shadowBlur = 12;
      const grad = ctx.createRadialGradient(
        mouseX - pulse * 0.25, mouseY - pulse * 0.25, 0,
        mouseX, mouseY, pulse
      );
      grad.addColorStop(0, "white");
      grad.addColorStop(0.35, isHover ? "#fef3c7" : "#f0e0ff");
      grad.addColorStop(0.75, isHover ? "#f59e0b" : "#a855f7");
      grad.addColorStop(1,    isHover ? "#92400e" : "#5b21b6");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(mouseX, mouseY, pulse, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Specular
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.arc(mouseX - pulse * 0.3, mouseY - pulse * 0.3, pulse * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  // Always render canvas — hidden unless power mode draws on it
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 99999,
        display: theme === "power" ? "block" : "none",
      }}
    />
  );
}
