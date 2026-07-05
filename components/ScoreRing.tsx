interface ScoreRingProps {
  score: number;
  size?: number;
  color?: string;
  label?: string;
  /** Set when rendering on a dark background. */
  dark?: boolean;
}

export default function ScoreRing({
  score,
  size = 180,
  color = "#13a4a1",
  label,
  dark = false,
}: ScoreRingProps) {
  const stroke = size * 0.075;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={dark ? "rgba(220, 229, 242, 0.2)" : "#dce5f2"}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className={`font-bold ${dark ? "text-white" : "text-navy-900"}`}
          style={{ fontSize: size * 0.24 }}
        >
          {clamped}
        </span>
        <span
          className={`text-xs font-medium uppercase tracking-wider ${
            dark ? "text-navy-300" : "text-navy-400"
          }`}
        >
          {label ?? "out of 100"}
        </span>
      </div>
    </div>
  );
}
