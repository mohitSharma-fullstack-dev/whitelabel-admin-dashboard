import { useState } from 'react';
import { Check, Plus, Lock, UserPlus, Users } from 'lucide-react';
import { roles as initialRoles, permissionKeys } from '../data/roles';
import CreateRoleModal from '../components/CreateRoleModal';
import InviteUserModal from '../components/InviteUserModal';
import AssignUserRoleModal from '../components/AssignUserRoleModal';
import Avatar from '../components/Avatar';
import { useUsers } from '../context/UsersContext';

export default function Roles() {
  const { users, inviteUser, updateUser } = useUsers();

  const [roles, setRoles] = useState(initialRoles);
  const [activeRoleId, setActiveRoleId] = useState(initialRoles[1].id);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState(null); // 'createRole' | 'inviteUser' | 'assignUser'

  const activeRole = roles.find((r) => r.id === activeRoleId);
  const isLocked = activeRole?.system;

  // Compute members dynamically from UsersContext
  const roleMembers = users.filter((u) => u.role === activeRole?.name);

  const togglePermission = (key) => {
    if (isLocked) return;
    setRoles((prev) =>
      prev.map((r) =>
        r.id === activeRoleId
          ? { ...r, permissions: { ...r.permissions, [key]: !r.permissions[key] } }
          : r
      )
    );
  };

  const handleCreateRole = ({ name, description, permissions }) => {
    const newRole = {
      id: `r${Date.now()}`,
      name,
      description,
      memberCount: 0,
      system: false,
      permissions,
    };
    setRoles((prev) => [...prev, newRole]);
    setActiveRoleId(newRole.id);
  };

  const handleAssignRole = (userId, roleName) => {
    updateUser(userId, { role: roleName });
  };

  const memberCountFor = (role) => users.filter((u) => u.role === role.name).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Roles & permissions</h1>
          <p className="page-subtitle">Control exactly what each role can do in your workspace.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('createRole')}>
          <Plus size={15} /> New role
        </button>
      </div>

      <div className="roles-grid">
        {/* Role list */}
        <div className="card">
          {roles.map((r) => (
            <button
              key={r.id}
              className={`role-list-item${r.id === activeRoleId ? ' active' : ''}`}
              onClick={() => { setActiveRoleId(r.id); setSaved(false); }}
            >
              <div style={{ minWidth: 0 }}>
                <div className="role-list-name">{r.name}</div>
                <div className="role-list-desc muted">{r.description}</div>
              </div>
              <div className="flex items-center gap-8">
                {r.system && <Lock size={12} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />}
                <span className="badge badge-neutral">{memberCountFor(r)}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Role detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Permissions card */}
          <div className="card card-pad">
            <div className="flex justify-between items-center" style={{ marginBottom: 4 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>{activeRole.name}</h3>
              {isLocked && (
                <span className="badge badge-neutral">
                  <Lock size={11} /> System role
                </span>
              )}
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: 4, marginBottom: 16 }}>
              {activeRole.description}
            </p>

            {isLocked && (
              <div className="role-locked-notice">
                <Lock size={13} />
                System roles cannot be edited. Duplicate this role to create a customised version.
              </div>
            )}

            <div className="permission-list">
              {permissionKeys.map((p) => (
                <div className="permission-row" key={p.key} style={{ opacity: isLocked ? 0.65 : 1 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.label}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{p.description}</div>
                  </div>
                  <button
                    className={`switch${activeRole.permissions[p.key] ? ' on' : ''}`}
                    onClick={() => togglePermission(p.key)}
                    disabled={isLocked}
                    aria-label={`Toggle ${p.label}`}
                    style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
                  >
                    <span className="knob" />
                  </button>
                </div>
              ))}
            </div>

            {!isLocked && (
              <button
                className="btn btn-primary"
                style={{ marginTop: 20 }}
                onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }}
              >
                {saved ? <><Check size={14} /> Saved</> : 'Save permissions'}
              </button>
            )}
          </div>

          {/* Members card */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={15} />
                Members with this role
                <span className="badge badge-neutral" style={{ fontWeight: 600 }}>
                  {roleMembers.length}
                </span>
              </h3>
              <div className="flex gap-8">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setModal('assignUser')}
                  title="Assign an existing user to this role"
                >
                  <Users size={13} /> Assign user
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setModal('inviteUser')}
                  title="Invite a new user with this role"
                >
                  <UserPlus size={13} /> Invite new user
                </button>
              </div>
            </div>

            <div style={{ padding: '6px 0' }}>
              {roleMembers.length === 0 ? (
                <div className="empty-state" style={{ padding: '28px 20px', fontSize: 13 }}>
                  No users have the <strong>{activeRole.name}</strong> role yet.
                  <br />
                  <span className="muted" style={{ fontSize: 12 }}>
                    Use "Invite new user" to create one or "Assign user" to reassign an existing user.
                  </span>
                </div>
              ) : (
                roleMembers.map((u) => (
                  <div key={u.id} className="member-row">
                    <Avatar initials={u.initials} color={u.color} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{u.name}</div>
                      <div className="muted" style={{ fontSize: 12 }}>{u.email}</div>
                    </div>
                    <span
                      className={`badge ${
                        u.status === 'active'
                          ? 'badge-success'
                          : u.status === 'invited'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                      style={{ fontSize: 11 }}
                    >
                      {u.status === 'active' ? 'Active' : u.status === 'invited' ? 'Invited' : 'Suspended'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === 'createRole' && (
        <CreateRoleModal
          onSave={handleCreateRole}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'inviteUser' && (
        <InviteUserModal
          defaultRole={activeRole.name}
          onInvite={inviteUser}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'assignUser' && (
        <AssignUserRoleModal
          role={activeRole}
          allUsers={users}
          onAssign={handleAssignRole}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
