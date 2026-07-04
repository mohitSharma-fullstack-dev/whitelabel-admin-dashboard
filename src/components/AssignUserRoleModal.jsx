import { useState } from 'react';
import { Search, Check } from 'lucide-react';
import Modal from './Modal';
import Avatar from './Avatar';

export default function AssignUserRoleModal({ role, allUsers, onAssign, onClose }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);

  // Only show users not already in this role
  const candidates = allUsers.filter((u) => u.role !== role.name);
  const filtered = candidates.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (userId) =>
    setSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );

  const handleConfirm = () => {
    selected.forEach((id) => onAssign(id, role.name));
    onClose();
  };

  return (
    <Modal title={`Assign users to "${role.name}"`} onClose={onClose} width={480}>
      <div className="modal-body">
        {candidates.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 40, paddingBottom: 20 }}>
            All workspace users already have the <strong>{role.name}</strong> role.
          </div>
        ) : (
          <>
            <p className="muted" style={{ fontSize: 13, marginTop: 0, marginBottom: 14 }}>
              Select users to assign the <strong>{role.name}</strong> role. Their current role will be replaced.
            </p>

            <div className="search-box" style={{ maxWidth: '100%', marginBottom: 10 }}>
              <Search size={14} className="muted" />
              <input
                placeholder="Search by name or email…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="user-picker-list">
              {filtered.length === 0 ? (
                <div style={{ padding: 14, fontSize: 13, color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
                  No users match "{query}".
                </div>
              ) : (
                filtered.map((u) => {
                  const isSelected = selected.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      className={`user-picker-item${isSelected ? ' selected' : ''}`}
                      onClick={() => toggle(u.id)}
                    >
                      <Avatar initials={u.initials} color={u.color} size={32} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{u.name}</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {u.email}
                          <span style={{ margin: '0 5px', opacity: 0.4 }}>·</span>
                          Current role: <strong>{u.role}</strong>
                        </div>
                      </div>
                      <div className="user-picker-check">
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {selected.length > 0 && (
              <div className="hint" style={{ marginTop: 8 }}>
                {selected.length} user{selected.length !== 1 ? 's' : ''} will be reassigned to <strong>{role.name}</strong>.
              </div>
            )}
          </>
        )}
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button
          className="btn btn-primary"
          onClick={handleConfirm}
          disabled={selected.length === 0}
        >
          Assign role
        </button>
      </div>
    </Modal>
  );
}
