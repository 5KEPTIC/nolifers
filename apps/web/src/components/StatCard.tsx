type StatCardProps = {
  label: string;
  value: string;
  delta: string;
};

export function StatCard({ label, value, delta }: StatCardProps) {
  return (
    <article className="panel stat-card">
      <div className="stat-card-head">
        <span className="eyebrow">{label}</span>
        <span className="stat-card-delta">{delta}</span>
      </div>
      <strong>{value}</strong>
    </article>
  );
}
