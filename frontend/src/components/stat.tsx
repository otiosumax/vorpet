import type { ReactNode } from "react";

interface StatProps {
  name: string;
  icon: ReactNode;
  value: number;
}

export default function Stat({ name, icon, value }: StatProps) {
  const percent = Math.min(100, Math.max(0, value));
  const formattedPercent = Math.round(percent);

  return (
    <div className="stat">
      <div className="stat-icon" aria-hidden="true">
        {icon}
      </div>

      <div className="stat-content">
        <div className="stat-header">
          <p className="stat-name">{name}</p>
          <span className="stat-value">{formattedPercent}%</span>
        </div>

        <div
          className="stat-progress"
          role="progressbar"
          aria-label={name}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={formattedPercent}
        >
          <div
            className="stat-progress-value"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
