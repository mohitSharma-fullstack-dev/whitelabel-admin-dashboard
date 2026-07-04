export default function StatCard({ icon: Icon, label, value, delta, deltaPositive = true, color }) {
  return (
    <div className="card card-pad stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon" style={{ background: `${color}1A`, color }}>
          <Icon size={17} strokeWidth={2.2} />
        </div>
        {delta && (
          <span className={`stat-delta ${deltaPositive ? 'up' : 'down'}`}>{delta}</span>
        )}
      </div>
      <div className="stat-card-value tabular">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
