import { depth, hangingPositions, SaggingString, Sparkles, Stars, vars } from "../scene-utils";

const FLAG_COLORS = ["#f472b6", "#facc15", "#60a5fa", "#34d399", "#c084fc", "#fb923c"];

const BACK_BALLOONS = [
  { x: 24, y: 30, size: 8, color: "#60a5fa", delay: 1.2, rise: 0.35 },
  { x: 68, y: 36, size: 7, color: "#c084fc", delay: 2.4, rise: 0.45 },
  { x: 44, y: 12, size: 6, color: "#34d399", delay: 0.8, rise: 0.55 },
];

const FRONT_BALLOONS = [
  { x: 2, y: 20, size: 15, color: "#f472b6", delay: 0, rise: 0.1 },
  { x: 14, y: 46, size: 11, color: "#facc15", delay: 1.6, rise: 0.25 },
  { x: 80, y: 16, size: 16, color: "#fb7185", delay: 0.6, rise: 0.05 },
  { x: 86, y: 44, size: 11, color: "#38bdf8", delay: 2, rise: 0.3 },
];

function Balloon({ x, y, size, color, delay, rise }: (typeof FRONT_BALLOONS)[number]) {
  return (
    <div
      className="balloon rise"
      style={{ left: `${x}%`, top: `${y}%`, width: `${size}vmin`, ...vars({ "--rise-delay": `${rise}s` }) }}
    >
      <div className="balloon-inner" style={{ animationDelay: `${delay}s` }}>
        <svg viewBox="0 0 60 120" aria-hidden="true">
          <path d="M30 67C24 80 36 92 30 118" stroke="rgba(255,255,255,.55)" strokeWidth="1" fill="none" />
          <ellipse cx="30" cy="32" rx="26" ry="31" fill={color} />
          <ellipse cx="38" cy="40" rx="16" ry="20" fill="#000" opacity="0.12" />
          <ellipse cx="21" cy="20" rx="6" ry="10" fill="#fff" opacity="0.4" transform="rotate(-20 21 20)" />
          <path d="M26 62L34 62L30 68Z" fill={color} />
        </svg>
      </div>
    </div>
  );
}

function Cake() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="100" cy="186" rx="92" ry="10" fill="#f5e6ff" opacity="0.85" />
      <rect x="20" y="120" width="160" height="64" rx="10" fill="#f472b6" />
      <path d="M20 132Q30 146 40 132T60 132T80 132T100 132T120 132T140 132T160 132T180 132V124Q180 120 176 120H24Q20 120 20 124Z" fill="#fff1f7" />
      <rect x="45" y="72" width="110" height="52" rx="10" fill="#fbcfe8" />
      <path d="M45 84Q55 96 65 84T85 84T105 84T125 84T145 84T155 84V76Q155 72 151 72H49Q45 72 45 76Z" fill="#ffffff" />
      {[
        [40, 158, "#facc15"], [70, 166, "#60a5fa"], [100, 154, "#34d399"], [130, 166, "#facc15"], [160, 156, "#c084fc"],
        [62, 108, "#f472b6"], [92, 112, "#60a5fa"], [124, 106, "#facc15"],
      ].map(([x, y, c], i) => (
        <rect key={i} x={x as number} y={y as number} width="8" height="3" rx="1.5" fill={c as string} transform={`rotate(${(i * 37) % 90 - 45} ${x} ${y})`} />
      ))}
      {[78, 98, 118].map((x, i) => (
        <g key={x}>
          <rect x={x} y="44" width="6" height="30" rx="2" fill={["#93c5fd", "#fde047", "#86efac"][i]} />
          <circle className="candle-glow" cx={x + 3} cy="34" r="11" fill="#fde68a" opacity="0.25" />
          <path className="flame" style={{ animationDuration: `${0.16 + i * 0.05}s` }} d={`M${x + 3} 24C${x + 8} 32 ${x + 8} 38 ${x + 3} 42C${x - 2} 38 ${x - 2} 32 ${x + 3} 24Z`} fill="#fbbf24" />
        </g>
      ))}
    </svg>
  );
}

export function BirthdayScene() {
  const flags = hangingPositions(15, 5);
  return (
    <>
      <div className="layer" style={depth(0.15)}>
        <Stars seed={11} />
      </div>
      <div className="layer" style={depth(0.35)}>
        <span className="bokeh" style={{ left: "8%", top: "58%", width: "38vmin", height: "38vmin", ...vars({ "--c": "rgba(236,72,153,.35)" }) }} />
        <span className="bokeh" style={{ left: "62%", top: "8%", width: "46vmin", height: "46vmin", ...vars({ "--c": "rgba(139,92,246,.35)" }) }} />
        <span className="bokeh" style={{ left: "70%", top: "64%", width: "30vmin", height: "30vmin", ...vars({ "--c": "rgba(250,204,21,.22)" }) }} />
      </div>
      <div className="layer" style={depth(0.6)}>
        {BACK_BALLOONS.map((b, i) => (
          <Balloon key={i} {...b} />
        ))}
      </div>
      <div className="layer" style={depth(0.9)}>
        <div className="hang" style={{ height: "14vmin" }}>
          <SaggingString sagVmin={5} heightVmin={14} color="rgba(255,255,255,.6)" />
          {flags.map((pos, i) => (
            <span
              key={i}
              className="flag"
              style={{ left: `${pos.left}%`, top: `${pos.top}vmin`, background: FLAG_COLORS[i % FLAG_COLORS.length], animationDelay: `${(i % 5) * 0.3}s` }}
            />
          ))}
        </div>
      </div>
      <div className="layer" style={depth(1.05)}>
        <div className="bottom-center" style={{ bottom: "9%" }}>
          <div className="rise cake" style={vars({ "--rise-delay": "0.25s" })}>
            <Cake />
          </div>
        </div>
      </div>
      <div className="layer" style={depth(1.35)}>
        {FRONT_BALLOONS.map((b, i) => (
          <Balloon key={i} {...b} />
        ))}
      </div>
      <div className="layer" style={depth(1.7)}>
        <Sparkles seed={5} color="#fde68a" />
      </div>
    </>
  );
}
