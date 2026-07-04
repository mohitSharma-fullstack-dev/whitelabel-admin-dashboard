import { useState } from 'react';
import { Send } from 'lucide-react';
import Modal from './Modal';
import { roles } from '../data/roles';

export default function InviteUserModal({ onInvite, onClose, defaultRole = 'Member' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required.';
    if (!email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = 'Enter a valid email address.';
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onInvite({ name: name.trim(), email: email.trim(), role });
    setSent(true);
    setTimeout(onClose, 1200);
  };

  if (sent) {
    return (
      <Modal title="Invite sent" onClose={onClose} width={400}>
        <div className="modal-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✉️</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Invitation sent!</div>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            {name} will receive an email to join your workspace as <strong>{role}</strong>.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Invite user" onClose={onClose} width={460}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="modal-body">
          <div className="field">
            <label>Full name *</label>
            <input
              className="input"
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
              autoFocus
            />
            {errors.name && <div style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 5 }}>{errors.name}</div>}
          </div>

          <div className="field">
            <label>Work email *</label>
            <input
              className="input"
              type="email"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
            />
            {errors.email && <div style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 5 }}>{errors.email}</div>}
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label>Role</label>
            <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
            <div className="hint">Sets the default permissions for this user. You can change this later.</div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">
            <Send size={14} /> Send invite
          </button>
        </div>
      </form>
    </Modal>
  );
}
