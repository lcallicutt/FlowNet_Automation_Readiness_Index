interface CategoryBarProps {
  name: string;
  icon?: string;
  score: number;
}

function barColor(score: number): string {
  if (score >= 80) return "bg-teal-500";
  if (score >= 60) return "bg-teal-400";
  if (score >= 40) return "bg-navy-400";
  return "bg-gold-500";
}

export default function CategoryBar({ name, icon, score }: CategoryBarProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-navy-800">
          {icon && <span className="mr-1.5">{icon}</span>}
          {name}
        </span>
        <span className="font-semibold text-navy-900">{score}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-navy-100">
        <div
          className={`h-full rounded-full ${barColor(score)} transition-all duration-700`}
          style={{ width: `${Math.max(3, Math.min(100, score))}%` }}
        />
      </div>
    </div>
  );
}
