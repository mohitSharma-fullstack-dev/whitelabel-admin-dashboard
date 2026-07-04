import { useState } from 'react';
import { Search, X, Check } from 'lucide-react';
import Modal from './Modal';
import Avatar from './Avatar';

const GROUP_COLORS = [
  '#3D5AFE', '#7B61FF', '#1F9D63', '#E0523F',
  '#FF7A59', '#0891B2', '#C2185B', '#F59E0B', '#1F6F6B',
];

export default function CreateGroupModal({ users, existingGroup, onSave, onClose }) {
  const isEdit = Boolean(existingGroup);

  const [name, setName] = useState(existingGroup?.name || '');
  const [description, setDescription] = useState(existingGroup?.description || '');
  const [color, setColor] = useState(existingGroup?.color || GROUP_COLORS[0]);
  const [memberIds, setMemberIds] = useState(existingGroup?.memberIds ? [...existingGroup.memberIds] : []);
  const [userQuery, setUserQuery] = useState('');
  const [error, setError] = useState('');

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userQuery.toLowerCase())
  );

  const toggleMember = (userId) => {
    setMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const removeMember = (userId) => {
    setMemberIds((prev) => prev.filter((id) => id !== userId));
  };

  const handleSubmit = () => {
    if (!name.trim()) { setError('Group name is required.'); return; }
    onSave({ name: name.trim(), description: description.trim(), color, memberIds });
    onClose();
  };

  const selectedUsers = users.filter((u) => memberIds.includes(u.id));

  return (
    <Modal title={isEdit ? 'Edit group' : 'Create group'} onClose={onClose} width={540}>
      <div className="modal-body">
        <div className="field">
          <label>Group name *</label>
          <input
            className="input"
            placeholder="e.g. Design Team"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            autoFocus
          />
          {error && <div style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 5 }}>{error}</div>}
        </div>

        <div className="field">
          <label>Description <span style={{ fontWeight: 400, color: 'var(--color-text-tertiary)' }}>(optional)</span></label>
          <input
            className="input"
            placeholder="What is this group for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Group colour</label>
          <div className="color-swatch-grid">
            {GROUP_COLORS.map((c) => (
              <button
                key={c}
                className={`color-swatch-btn${color === c ? ' selected' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        <div className="field">
          <label>Members</label>

          {selectedUsers.length > 0 && (
            <div className="selected-users-row" style={{ marginBottom: 10 }}>
              {selectedUsers.map((u) => (
                <span key={u.id} className="selected-user-chip">
                  <Avatar initials={u.initials} color={u.color} size={16} />
                  {u.name.split(' ')[0]}
                  <button onClick={() => removeMember(u.id)} aria-label={`Remove ${u.name}`}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div
            className="search-box"
            style={{ marginBottom: 6, maxWidth: '100%' }}
          >
            <Search size={14} className="muted" />
            <input
              placeholder="Search users to add…"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
            />
          </div>

          <div className="user-picker-list">
            {filteredUsers.length === 0 && (
              <div style={{ padding: '14px', fontSize: 13, color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
                No users found.
              </div>
            )}
            {filteredUsers.map((u) => {
              const selected = memberIds.includes(u.id);
              return (
                <div
                  key={u.id}
                  className={`user-picker-item${selected ? ' selected' : ''}`}
                  onClick={() => toggleMember(u.id)}
                >
                  <Avatar initials={u.initials} color={u.color} size={30} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{u.name}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{u.email}</div>
                  </div>
                  <div className="user-picker-check">
                    {selected && <Check size={11} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hint">
            {memberIds.length === 0 ? 'No members selected yet.' : `${memberIds.length} member${memberIds.length !== 1 ? 's' : ''} selected.`}
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {isEdit ? 'Save changes' : 'Create group'}
        </button>
      </div>
    </Modal>
  );
}
