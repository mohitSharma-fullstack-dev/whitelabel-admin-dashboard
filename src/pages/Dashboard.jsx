import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Users, UsersRound, FileUp,
  UserPlus, Ban, ShieldCheck, Webhook,
  Palette, Settings, TrendingUp, Activity,
  MessagesSquare, ArrowUpRight,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Avatar from '../components/Avatar';
import { useUsers } from '../context/UsersContext';
import { useGroups } from '../context/GroupsContext';
import { useConfig } from '../context/ConfigContext';

/* ── Mock data ─────────────────────────────────────────── */
const MSG_7D  = [420, 512, 388, 601, 734, 690, 812];
const MSG_30D = [980, 1120, 860, 1340, 1050, 1480, 1210, 1620, 1380, 1740, 1520, 1890, 1660, 2010];
const LABELS_7D  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const LABELS_30D = ['D1','D3','D5','D7','D9','D11','D13','D15','D17','D19','D21','D23','D25','D27'];

const SPARKLINES = {
  users:    [210, 230, 240, 255, 270, 280, 295, 310, 318, 325, 340, 348, 356, 365],
  groups:   [2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6],
  messages: [3100, 3250, 3400, 3280, 3520, 3700, 3850, 3960, 3820, 4050, 4120, 4250, 4080, 4157],
  files:    [280, 295, 310, 302, 318, 325, 308, 340, 319, 326, 332, 315, 320, 312],
};

const ACTIVITY = [
  { icon: MessageSquare,  color: '#3D5AFE', text: 'Meera Iyer sent 58 messages in Customer Support',    time: 'Just now'   },
  { icon: UserPlus,       color: '#34A876', text: 'James Whitfield was invited to the workspace',         time: '12 min ago' },
  { icon: UsersRound,     color: '#E0523F', text: 'Design Crit group was created by Ananya Kapoor',       time: '1 hr ago'   },
  { icon: ShieldCheck,    color: '#7B61FF', text: 'Meera Iyer promoted to Moderator',                     time: '2 hr ago'   },
  { icon: FileUp,         color: '#FF7A59', text: 'Sofia Torres shared a file in Product Team',            time: '3 hr ago'   },
  { icon: Ban,            color: '#E0523F', text: 'Daniel Osei was suspended by admin',                   time: '6 days ago' },
  { icon: Webhook,        color: '#0891B2', text: 'CRM sync webhook triggered — user.created event',      time: '6 days ago' },
];

const QUICK_ACTIONS = [
  { label: 'Invite user',        icon: UserPlus,      to: '/users',    color: '#3D5AFE' },
  { label: 'Create group',       icon: UsersRound,    to: '/groups',   color: '#7B61FF' },
  { label: 'Configure branding', icon: Palette,       to: '/branding', color: '#FF7A59' },
  { label: 'Manage webhooks',    icon: Webhook,       to: '/webhooks', color: '#0891B2' },
  { label: 'App settings',       icon: Settings,      to: '/settings', color: '#1F9D63' },
  { label: 'Roles & perms',      icon: ShieldCheck,   to: '/roles',    color: '#C2185B' },
];

/* ── Sparkline ─────────────────────────────────────────── */
function Sparkline({ data, color }) {
  const w = 88, h = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block', opacity: 0.7 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Bar chart ─────────────────────────────────────────── */
function BarChart({ values, labels, color }) {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(...values);
  return (
    <div className="bar-chart">
      {values.map((v, i) => (
        <div
          className="bar-col"
          key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{ position: 'relative' }}
        >
          {hovered === i && (
            <div className="bar-tooltip">
              <span className="bar-tooltip-val">{v.toLocaleString()}</span>
              <span className="bar-tooltip-label">messages</span>
            </div>
          )}
          <div
            className="bar"
            style={{
              height: `${(v / max) * 100}%`,
              background: hovered === i ? color : `${color}55`,
              transition: 'background 0.15s ease, height 0.3s ease',
            }}
          />
          <span className="bar-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Main component ────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { config } = useConfig();
  const { users } = useUsers();
  const { groups } = useGroups();

  const [range, setRange] = useState('7d');
  const values = range === '7d' ? MSG_7D : MSG_30D;
  const labels = range === '7d' ? LABELS_7D : LABELS_30D;
  const totalMsgs = values.reduce((a, b) => a + b, 0);
  const avgMsgs = Math.round(totalMsgs / values.length);

  const primary = config.colors.primary;
  const accent  = config.colors.accent;

  // Top groups sorted by messages
  const topGroups = [...groups].sort((a, b) => b.messages - a.messages).slice(0, 4);
  const maxGroupMsgs = topGroups[0]?.messages || 1;

  // Recently active users (clickable)
  const recentUsers = [...users]
    .filter((u) => u.status === 'active')
    .slice(0, 5);

  const onlineCount = users.filter((u) => ['Just now', '2 min ago', '5 min ago'].includes(u.lastActive)).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">
            What's happening across <strong>{config.appName}</strong> today.
          </p>
        </div>
        <div className="flex items-center gap-8">
          <span className="online-badge">
            <span className="online-dot" />
            {onlineCount} online now
          </span>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card-link" onClick={() => navigate('/users')}>
          <StatCard
            icon={Users}
            label="Total users"
            value={users.length.toLocaleString()}
            delta="+4.2%"
            color={primary}
          />
          <div className="stat-sparkline">
            <Sparkline data={SPARKLINES.users} color={primary} />
          </div>
        </div>
        <div className="stat-card-link" onClick={() => navigate('/groups')}>
          <StatCard
            icon={UsersRound}
            label="Active groups"
            value={groups.length}
            delta="+1 this week"
            color="#3D5AFE"
          />
          <div className="stat-sparkline">
            <Sparkline data={SPARKLINES.groups} color="#3D5AFE" />
          </div>
        </div>
        <div className="stat-card-link">
          <StatCard
            icon={MessageSquare}
            label="Messages (7d)"
            value="4,157"
            delta="+18.6%"
            color={accent}
          />
          <div className="stat-sparkline">
            <Sparkline data={SPARKLINES.messages} color={accent} />
          </div>
        </div>
        <div className="stat-card-link">
          <StatCard
            icon={FileUp}
            label="Files shared (7d)"
            value="312"
            delta="-2.1%"
            deltaPositive={false}
            color="#7B61FF"
          />
          <div className="stat-sparkline">
            <Sparkline data={SPARKLINES.files} color="#7B61FF" />
          </div>
        </div>
      </div>

      {/* ── Chart + Top groups ── */}
      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        {/* Bar chart */}
        <div className="card card-pad">
          <div className="flex justify-between items-center" style={{ marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 700 }}>
                <Activity size={15} style={{ display: 'inline', marginRight: 7, verticalAlign: 'middle', color: primary }} />
                Message activity
              </h3>
              <span className="muted" style={{ fontSize: 12 }}>
                {totalMsgs.toLocaleString()} total · {avgMsgs.toLocaleString()} avg/day
              </span>
            </div>
            <div className="range-tabs">
              {['7d', '30d'].map((r) => (
                <button
                  key={r}
                  className={`range-tab${range === r ? ' active' : ''}`}
                  onClick={() => setRange(r)}
                  style={range === r ? { background: primary, color: '#fff', borderColor: primary } : {}}
                >
                  {r === '7d' ? '7 days' : '30 days'}
                </button>
              ))}
            </div>
          </div>
          <BarChart values={values} labels={labels} color={primary} />
        </div>

        {/* Top groups */}
        <div className="card">
          <div className="card-header">
            <h3>Top groups by activity</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/groups')}>
              View all <ArrowUpRight size={12} />
            </button>
          </div>
          <div style={{ padding: '10px 20px 14px' }}>
            {topGroups.length === 0 && (
              <div className="empty-state" style={{ padding: 20 }}>No groups yet.</div>
            )}
            {topGroups.map((g) => (
              <div
                key={g.id}
                className="top-group-row"
                onClick={() => navigate(`/groups/${g.id}`)}
              >
                <Avatar initials={g.initials} color={g.color} size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 5 }}>{g.name}</div>
                  <div className="activity-bar-track">
                    <div
                      className="activity-bar-fill"
                      style={{
                        width: `${(g.messages / maxGroupMsgs) * 100}%`,
                        background: g.color,
                      }}
                    />
                  </div>
                </div>
                <span className="muted" style={{ fontSize: 12, flexShrink: 0 }}>
                  {g.messages.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Activity feed + Right column ── */}
      <div className="dashboard-grid">
        {/* Activity feed */}
        <div className="card">
          <div className="card-header">
            <h3>
              <TrendingUp size={14} style={{ display: 'inline', marginRight: 7, verticalAlign: 'middle' }} />
              Recent activity
            </h3>
          </div>
          <div className="activity-feed">
            {ACTIVITY.map((ev, i) => (
              <div className="activity-row" key={i}>
                <div className="activity-icon" style={{ background: `${ev.color}18`, color: ev.color }}>
                  <ev.icon size={13} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>{ev.text}</div>
                </div>
                <span className="muted" style={{ fontSize: 11.5, flexShrink: 0 }}>{ev.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Recently active */}
          <div className="card">
            <div className="card-header">
              <h3>Recently active</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/users')}>
                View all <ArrowUpRight size={12} />
              </button>
            </div>
            <div style={{ padding: '4px 0 8px' }}>
              {recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="recent-user-row clickable-row"
                  onClick={() => navigate(`/users/${u.id}`)}
                >
                  <div style={{ position: 'relative' }}>
                    <Avatar initials={u.initials} color={u.color} size={30} />
                    <span
                      className="online-indicator"
                      style={{
                        background: ['Just now', '2 min ago', '5 min ago'].includes(u.lastActive)
                          ? config.colors.success
                          : 'var(--color-border)',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="recent-user-name">{u.name}</div>
                    <div className="recent-user-meta muted">{u.lastActive}</div>
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: 11 }}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card card-pad">
            <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>Quick actions</h3>
            <div className="quick-actions-grid">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  className="quick-action-btn"
                  onClick={() => navigate(a.to)}
                >
                  <div className="quick-action-icon" style={{ background: `${a.color}18`, color: a.color }}>
                    <a.icon size={16} />
                  </div>
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
