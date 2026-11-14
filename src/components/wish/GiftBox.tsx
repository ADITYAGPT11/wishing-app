export function GiftBox() {
  return (
    <svg viewBox="0 0 200 200" className="gift-svg" aria-hidden="true">
      <g className="gift-rays">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d="M100 92L92 0H108Z" fill="#fff7d6" opacity="0.7" transform={`rotate(${(i - 4) * 16} 100 92)`} />
        ))}
      </g>
      <g className="gift-body">
        <rect x="30" y="95" width="140" height="90" rx="8" fill="var(--box)" />
        <rect x="100" y="95" width="70" height="90" fill="#000" opacity="0.1" />
        <rect x="90" y="95" width="20" height="90" fill="var(--ribbon)" />
      </g>
      <g className="gift-lid">
        <rect x="22" y="72" width="156" height="30" rx="6" fill="var(--box-lid)" />
        <rect x="90" y="72" width="20" height="30" fill="var(--ribbon)" />
        <path d="M100 72C70 38 46 68 100 72Z" fill="var(--ribbon)" />
        <path d="M100 72C130 38 154 68 100 72Z" fill="var(--ribbon)" />
        <circle cx="100" cy="72" r="7" fill="var(--ribbon)" />
        <circle cx="100" cy="72" r="3" fill="#000" opacity="0.15" />
      </g>
    </svg>
  );
}
