import type { MetricValue } from "../lib/types";
import "./MetricCard.css";

interface MetricCardProps {
  label: string;
  metric: MetricValue;
  unit: "mph" | "yd" | "deg" | "rpm" | "x";
  format: (value: number | null, unit: MetricCardProps["unit"]) => string;
}

export function MetricCard({ label, metric, unit, format }: MetricCardProps) {
  const isAvailable = metric.source !== "not_available" && metric.value !== null;
  const sourceClass = isAvailable ? `metric-card--${metric.source}` : "metric-card--empty";

  return (
    <div className={`metric-card ${sourceClass}`}>
      <div className="metric-card__label">{label}</div>
      <div className="metric-card__value mono">{format(metric.value, unit)}</div>
    </div>
  );
}
