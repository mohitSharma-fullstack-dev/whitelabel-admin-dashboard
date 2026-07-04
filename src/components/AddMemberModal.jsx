import { useState } from 'react';
import { Search, Check } from 'lucide-react';
import Modal from './Modal';
import Avatar from './Avatar';

export default function AddMemberModal({ group, allUsers, onAdd, onClose }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);

  const nonMembers = allUsers.filter((u) => !group.memberIds.includes(u.id));
  const filtered = nonMembers.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (userId) => {
    setSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAdd = () => {
    selected.forEach((id) => onAdd(group.id, id));
    onClose();
  };

  return (
    <Modal title={`Add members to ${group.name}`} onClose={onClose} width={480}>
      <div className="modal-body">
        {nonMembers.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 40, paddingBottom: 20 }}>
            All workspace users are already in this group.
          </div>
        ) : (
          <>
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
              {filtered.length === 0 && (
                <div style={{ padding: 14, fontSize: 13, color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
                  No users match "{query}".
                </div>
              )}
              {filtered.map((u) => {
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
                      <div className="muted" style={{ fontSize: 12 }}>{u.email} · {u.role}</div>
                    </div>
                    <div className="user-picker-check">
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hint" style={{ marginTop: 8 }}>
              {selected.length === 0
                ? 'Select users to add.'
                : `${selected.length} user${selected.length !== 1 ? 's' : ''} selected.`}
            </div>
          </>
        )}
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          disabled={selected.length === 0}
        >
          Add {selected.length > 0 ? `${selected.length} member${selected.length !== 1 ? 's' : ''}` : 'members'}
        </button>
      </div>
    </Modal>
  );
}
