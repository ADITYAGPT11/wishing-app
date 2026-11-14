import { depth, hangingPositions, SaggingString, Sparkles, Stars, vars } from "../scene-utils";

const BULB_COLORS = ["#fde047", "#fb923c", "#f472b6", "#a3e635", "#60a5fa"];

const LANTERNS = [
  { x: 4, cord: 10, color: "#f97316", delay: 0, size: 11 },
  { x: 22, cord: 20, color: "#db2777", delay: 0.8, size: 8 },
  { x: 72, cord: 16, color: "#eab308", delay: 0.4, size: 9 },
  { x: 86, cord: 6, color: "#ef4444", delay: 1.2, size: 12 },
];

function Lantern({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 60 120" aria-hidden="true">
      <rect x="22" y="0" width="16" height="9" rx="2" fill="#fbbf24" />
      <path d="M30 8L54 44L30 84L6 44Z" fill={color} />
      <path d="M30 20L44 44L30 70L16 44Z" fill="#fff3c4" opacity="0.6" />
      <path d="M30 8V84M6 44H54M18 26L42 62M42 26L18 62" stroke="#000" strokeOpacity="0.18" strokeWidth="1" />
      <rect x="25" y="82" width="10" height="6" rx="1" fill="#fbbf24" />
      {[24, 28, 32, 36].map((x) => (
        <path key={x} d={`M${x} 88V${112 + (x % 8)}`} stroke={color} strokeWidth="2" strokeLinecap="round" />
      ))}
    </svg>
  );
}

function Diya({ flicker }: { flicker: number }) {
  return (
    <svg viewBox="0 0 100 90" aria-hidden="true">
      <circle className="diya-glow" cx="50" cy="28" r="26" fill="#ffb347" opacity="0.22" />
      <circle cx="50" cy="30" r="14" fill="#ffd27a" opacity="0.3" />
      <g className="flame" style={{ animationDuration: `${flicker}s` }}>
        <path d="M50 6C59 21 61 30 50 41C39 30 41 21 50 6Z" fill="#fbbf24" />
        <path d="M50 18C54 26 55 31 50 37C45 31 46 26 50 18Z" fill="#fff7cc" />
      </g>
      <rect x="49" y="38" width="2" height="7" fill="#3f1d0b" />
      <path d="M8 46Q50 98 92 46Z" fill="#b45309" />
      <ellipse cx="50" cy="46" rx="42" ry="8" fill="#f59e0b" />
      <ellipse cx="50" cy="46" rx="34" ry="5" fill="#78350f" />
      <path d="M22 58Q28 64 34 58Q40 64 46 58Q52 64 58 58Q64 64 70 58Q76 64 80 58" stroke="#fde68a" strokeWidth="2" fill="none" />
      {[30, 50, 70].map((x) => (
        <circle key={x} cx={x} cy={x === 50 ? 72 : 67} r="3" fill="#fde68a" />
      ))}
    </svg>
  );
}

function Rangoli() {
  const ring = (count: number, radius: number, rx: number, ry: number, color: string) =>
    Array.from({ length: count }, (_, i) => (
      <ellipse key={`${radius}-${i}`} cx="0" cy={-radius} rx={rx} ry={ry} fill={color} transform={`rotate(${(i * 360) / count})`} />
    ));
  return (
    <svg viewBox="-100 -100 200 200" aria-hidden="true">
      <circle r="96" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
      {Array.from({ length: 24 }, (_, i) => (
        <circle key={i} r="3" cx="0" cy="-86" fill="#fef3c7" transform={`rotate(${i * 15})`} />
      ))}
      {ring(16, 70, 10, 20, "#db2777")}
      {ring(12, 48, 11, 21, "#f97316")}
      {ring(8, 27, 9, 17, "#facc15")}
      <circle r="15" fill="#14b8a6" />
      <circle r="7" fill="#fef3c7" />
    </svg>
  );
}

export function DiwaliScene() {
  const bulbs = hangingPositions(21, 6);
  return (
    <>
      <div className="layer" style={depth(0.15)}>
        <Stars seed={21} count={45} maxTop={60} />
      </div>
      <div className="layer" style={depth(0.55)}>
        {LANTERNS.map((l, i) => (
          <div key={i} className="lantern" style={{ left: `${l.x}%`, width: `${l.size}vmin`, animationDelay: `${l.delay}s` }}>
            <div className="lantern-cord" style={{ height: `${l.cord}vh` }} />
            <Lantern color={l.color} />
          </div>
        ))}
      </div>
      <div className="layer" style={depth(0.85)}>
        <div className="hang" style={{ height: "16vmin" }}>
          <SaggingString sagVmin={6} heightVmin={16} color="rgba(255,236,200,.45)" />
          {bulbs.map((pos, i) => (
            <span
              key={i}
              className="bulb"
              style={{ left: `${pos.left}%`, top: `${pos.top}vmin`, animationDelay: `${(i % 4) * 0.45}s`, ...vars({ "--c": BULB_COLORS[i % BULB_COLORS.length] }) }}
            />
          ))}
        </div>
      </div>
      <div className="layer" style={depth(0.8)}>
        <div className="bottom-center" style={{ bottom: "-10vmin" }}>
          <div className="rise rangoli" style={vars({ "--rise-delay": "0.1s" })}>
            <Rangoli />
          </div>
        </div>
      </div>
      <div className="layer" style={depth(1.3)}>
        <div className="diyas">
          {[0.14, 0.2, 0.17, 0.22, 0.15].map((flicker, i) => (
            <div key={i} className={`rise diya ${i === 2 ? "diya-center" : ""}`} style={vars({ "--rise-delay": `${0.2 + Math.abs(2 - i) * 0.15}s` })}>
              <Diya flicker={flicker} />
            </div>
          ))}
        </div>
      </div>
      <div className="layer" style={depth(1.7)}>
        <Sparkles seed={9} color="#fcd34d" />
      </div>
    </>
  );
}
