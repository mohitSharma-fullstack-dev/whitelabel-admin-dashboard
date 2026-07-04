import { useState } from 'react';
import Modal from './Modal';
import { permissionKeys } from '../data/roles';

const EMPTY_PERMISSIONS = Object.fromEntries(permissionKeys.map((p) => [p.key, false]));

export default function CreateRoleModal({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState(EMPTY_PERMISSIONS);
  const [error, setError] = useState('');

  const toggle = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    if (!name.trim()) { setError('Role name is required.'); return; }
    onSave({ name: name.trim(), description: description.trim(), permissions });
    onClose();
  };

  return (
    <Modal title="New role" onClose={onClose} width={500}>
      <div className="modal-body">
        <div className="field">
          <label>Role name *</label>
          <input
            className="input"
            placeholder="e.g. Content Manager"
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
            placeholder="What can this role do?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 4 }}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 10 }}>Permissions</label>
          <div className="permission-list" style={{ border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
            {permissionKeys.map((p) => (
              <div className="permission-row" key={p.key} style={{ padding: '12px 16px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.label}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{p.description}</div>
                </div>
                <button
                  className={`switch${permissions[p.key] ? ' on' : ''}`}
                  onClick={() => toggle(p.key)}
                  aria-label={`Toggle ${p.label}`}
                  type="button"
                >
                  <span className="knob" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Create role</button>
      </div>
    </Modal>
  );
}
