import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, Clock, Ban, RotateCcw, Check } from 'lucide-react';
import Avatar from '../components/Avatar';
import { useUsers } from '../context/UsersContext';
import { roles } from '../data/roles';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { findUser, updateUser } = useUsers();

  const user = findUser(id);

  const [role, setRole] = useState(user?.role || 'Member');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [status, setStatus] = useState(user?.status || 'active');
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <div className="page">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/users')} style={{ marginBottom: 18 }}>
          <ArrowLeft size={14} /> Back to users
        </button>
        <p>User not found.</p>
      </div>
    );
  }

  const handleSave = () => {
    updateUser(id, { role, name: displayName.trim() || user.name, status });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="page">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/users')} style={{ marginBottom: 18 }}>
        <ArrowLeft size={14} /> Back to users
      </button>

      <div className="detail-grid">
        <div className="card card-pad" style={{ textAlign: 'center' }}>
          <Avatar
            initials={user.initials}
            color={user.color}
            size={72}
            style={{ margin: '0 auto 14px', fontSize: 26 }}
          />
          <div style={{ fontSize: 17, fontWeight: 700 }}>{user.name}</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{user.email}</div>

          <div className="user-meta-list">
            <div className="user-meta-row">
              <Mail size={14} className="muted" /> <span>{user.email}</span>
            </div>
            <div className="user-meta-row">
              <Calendar size={14} className="muted" /> <span>Joined {user.joined}</span>
            </div>
            <div className="user-meta-row">
              <Clock size={14} className="muted" /> <span>Active {user.lastActive}</span>
            </div>
          </div>

          {status === 'active' ? (
            <button
              className="btn btn-danger"
              style={{ width: '100%', marginTop: 18 }}
              onClick={() => setStatus('suspended')}
            >
              <Ban size={14} /> Suspend user
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: 18 }}
              onClick={() => setStatus('active')}
            >
              <RotateCcw size={14} /> Reactivate user
            </button>
          )}
        </div>

        <div className="card card-pad">
          <h3 style={{ marginTop: 0, marginBottom: 18, fontSize: 15 }}>Access & role</h3>

          <div className="field">
            <label>Display name</label>
            <input
              className="input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Role</label>
            <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
            <div className="hint">
              Determines what {user.name.split(' ')[0]} can do — manage permissions from Roles & Permissions.
            </div>
          </div>

          <div className="field">
            <label>Status</label>
            <span className={`badge ${status === 'active' ? 'badge-success' : status === 'invited' ? 'badge-warning' : 'badge-danger'}`}>
              {status === 'active' ? 'Active' : status === 'invited' ? 'Invited' : 'Suspended'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={handleSave}>
              {saved ? <><Check size={14} /> Saved</> : 'Save changes'}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/users')}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
