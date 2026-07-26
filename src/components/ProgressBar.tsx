export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      {label ? <div className="progress__label"><span>{label}</span><span>{value}%</span></div> : null}
      <div className="progress__track">
        <div className="progress__fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  )
}
