import type { CSSProperties } from "react";

// Parallax depth for a layer: bigger = moves more = feels closer.
export function depth(value: number): CSSProperties {
  return { "--d": value } as CSSProperties;
}

export function vars(values: Record<string, string | number>): CSSProperties {
  return values as CSSProperties;
}

// Small deterministic PRNG so server and client render identical star fields.
export function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 100) / 100;

export function Stars({ count = 60, seed = 7, maxTop = 75 }: { count?: number; seed?: number; maxTop?: number }) {
  const rand = seeded(seed);
  const stars = Array.from({ length: count }, () => ({
    left: round(rand() * 100),
    top: round(rand() * maxTop),
    size: round(1 + rand() * 2.2),
    delay: round(rand() * 4),
    duration: round(2 + rand() * 3),
  }));
  return (
    <>
      {stars.map((star, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </>
  );
}

export function Sparkles({ seed = 3, color = "#fde68a", count = 10 }: { seed?: number; color?: string; count?: number }) {
  const rand = seeded(seed);
  const items = Array.from({ length: count }, (_, i) => {
    const leftSide = i % 2 === 0;
    return {
      left: round(leftSide ? 2 + rand() * 16 : 82 + rand() * 16),
      top: round(12 + rand() * 76),
      size: round(2.2 + rand() * 3),
      delay: round(rand() * 3),
    };
  });
  return (
    <>
      {items.map((s, i) => (
        <svg
          key={i}
          className="sparkle"
          viewBox="0 0 24 24"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: `${s.size}vmin`, animationDelay: `${s.delay}s` }}
        >
          <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" fill={color} />
        </svg>
      ))}
    </>
  );
}

// Items hung along a sagging string across the top (bunting flags, fairy lights).
export function hangingPositions(count: number, sagVmin: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    return { left: round(t * 100), top: round(4 * t * (1 - t) * sagVmin) };
  });
}

export function SaggingString({ sagVmin, heightVmin, color }: { sagVmin: number; heightVmin: number; color: string }) {
  const control = (2 * sagVmin * 100) / heightVmin;
  return (
    <svg className="hang-string" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={`M0 0 Q500 ${control} 1000 0`} stroke={color} strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
