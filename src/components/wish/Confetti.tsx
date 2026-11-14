"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, type Ref } from "react";

export type BurstKind = "celebrate" | "firework" | "hearts";

export interface ConfettiHandle {
  burst: (kind?: BurstKind) => void;
}

type Shape = "rect" | "circle" | "heart";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  shape: Shape;
  life: number;
  ttl: number;
  drag: number;
  gravity: number;
  glow: boolean;
}

const COLORS = {
  confetti: ["#f472b6", "#facc15", "#60a5fa", "#34d399", "#c084fc", "#fb7185"],
  sparks: ["#fde047", "#fbbf24", "#fb923c", "#f472b6", "#fef3c7"],
  hearts: ["#fb7185", "#f43f5e", "#f9a8d4", "#fda4af"],
};

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const range = (min: number, max: number) => min + Math.random() * (max - min);

function drawHeart(ctx: CanvasRenderingContext2D, s: number) {
  ctx.translate(0, -s / 2);
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(0, 0, -s * 0.5, 0, -s * 0.5, s * 0.3);
  ctx.bezierCurveTo(-s * 0.5, s * 0.6, 0, s * 0.8, 0, s);
  ctx.bezierCurveTo(0, s * 0.8, s * 0.5, s * 0.6, s * 0.5, s * 0.3);
  ctx.bezierCurveTo(s * 0.5, 0, 0, 0, 0, s * 0.3);
  ctx.fill();
}

export function Confetti({ ref, mode }: { ref?: Ref<ConfettiHandle>; mode: "confetti" | "sparks" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const frame = useRef(0);
  const running = useRef(false);
  const lastTime = useRef(0);
  const reduced = useRef(false);
  const timers = useRef<number[]>([]);
  const stepRef = useRef<FrameRequestCallback | null>(null);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const pending = timers.current;
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame.current);
      pending.forEach((id) => window.clearTimeout(id));
      running.current = false;
    };
  }, []);

  const step = useCallback((time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      running.current = false;
      return;
    }
    const k = Math.min((time - lastTime.current) / 16.67 || 1, 2.5);
    lastTime.current = time;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    const list = particles.current;
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      p.life += k;
      p.vx *= Math.pow(p.drag, k);
      p.vy = p.vy * Math.pow(p.drag, k) + p.gravity * k;
      p.x += p.vx * k;
      p.y += p.vy * k;
      p.rot += p.vr * k;
      if (p.life > p.ttl || p.y > h + 40 || p.y < -80) {
        list.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, (p.ttl - p.life) / 40));
      ctx.globalCompositeOperation = p.glow ? "lighter" : "source-over";
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      else if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else drawHeart(ctx, p.size);
      ctx.restore();
    }

    if (list.length) frame.current = requestAnimationFrame((t) => stepRef.current?.(t));
    else running.current = false;
  }, []);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const start = useCallback(() => {
    if (running.current) return;
    running.current = true;
    lastTime.current = performance.now();
    frame.current = requestAnimationFrame(step);
  }, [step]);

  const firework = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const cx = range(0.15, 0.85) * w;
    const cy = range(0.12, 0.42) * h;
    const count = reduced.current ? 18 : 70;
    const base = pick(COLORS.sparks);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + range(-0.05, 0.05);
      const speed = range(2, 6);
      particles.current.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        rot: 0, vr: 0, size: range(2, 3.6),
        color: Math.random() < 0.7 ? base : pick(COLORS.sparks),
        shape: "circle", life: 0, ttl: range(60, 95), drag: 0.965, gravity: 0.05, glow: true,
      });
    }
    start();
  }, [start]);

  const confettiCannons = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const count = reduced.current ? 30 : 150;
    for (let i = 0; i < count; i++) {
      const fromLeft = i % 2 === 0;
      const angle = (fromLeft ? -60 : -120) * (Math.PI / 180) + range(-0.28, 0.28);
      const speed = range(10, 19) * Math.min(1, h / 800 + 0.25);
      particles.current.push({
        x: fromLeft ? 0 : w, y: h,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        rot: range(0, Math.PI), vr: range(-0.2, 0.2), size: range(7, 12),
        color: pick(mode === "sparks" ? COLORS.sparks : COLORS.confetti),
        shape: Math.random() < 0.75 ? "rect" : "circle",
        life: 0, ttl: 260, drag: 0.985, gravity: 0.24, glow: false,
      });
    }
    start();
  }, [mode, start]);

  const hearts = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const count = reduced.current ? 8 : 26;
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: w / 2 + range(-50, 50), y: h - 90,
        vx: range(-2.6, 2.6), vy: range(-9, -4),
        rot: range(-0.3, 0.3), vr: range(-0.02, 0.02), size: range(12, 22),
        color: pick(COLORS.hearts), shape: "heart",
        life: 0, ttl: range(110, 150), drag: 0.985, gravity: 0.03, glow: false,
      });
    }
    start();
  }, [start]);

  useImperativeHandle(
    ref,
    () => ({
      burst(kind: BurstKind = "celebrate") {
        if (kind === "hearts") return hearts();
        if (kind === "firework") return firework();
        if (mode === "sparks") {
          [0, 380, 760].forEach((delay) => timers.current.push(window.setTimeout(firework, delay)));
        }
        confettiCannons();
      },
    }),
    [mode, firework, confettiCannons, hearts],
  );

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}
