import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserMinus, UserPlus, Trash2, MessagesSquare, Pencil } from 'lucide-react';
import Avatar from '../components/Avatar';
import ConfirmModal from '../components/ConfirmModal';
import AddMemberModal from '../components/AddMemberModal';
import GroupChatModal from '../components/GroupChatModal';
import CreateGroupModal from '../components/CreateGroupModal';
import { useGroups } from '../context/GroupsContext';
import { useUsers } from '../context/UsersContext';

const PERMISSION_OPTIONS = ['Everyone', 'Admins only'];

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { findGroup, updateGroup, deleteGroup, addMember, removeMember } = useGroups();
  const { users, findUser } = useUsers();

  const group = findGroup(id);

  const [permissions, setPermissions] = useState(group?.permissions || {});
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState(null); // 'delete' | 'addMember' | 'chat' | 'edit' | { type: 'removeMember', userId }

  if (!group) {
    return (
      <div className="page">
        <p>Group not found.</p>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/groups')}>
          <ArrowLeft size={14} /> Back to groups
        </button>
      </div>
    );
  }

  const members = group.memberIds.map(findUser).filter(Boolean);

  const handleSavePermissions = () => {
    updateGroup(id, { permissions });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleDelete = () => {
    deleteGroup(id);
    navigate('/groups');
  };

  const handleRemoveMember = (userId) => {
    removeMember(id, userId);
  };

  const closeModal = () => setModal(null);

  return (
    <div className="page">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/groups')} style={{ marginBottom: 18 }}>
        <ArrowLeft size={14} /> Back to groups
      </button>

      <div className="page-header">
        <div className="flex items-center gap-16">
          <Avatar initials={group.initials} color={group.color} size={54} />
          <div>
            <h1 className="page-title" style={{ marginBottom: 2 }}>{group.name}</h1>
            {group.description && (
              <p className="muted" style={{ fontSize: 13, margin: '0 0 2px' }}>{group.description}</p>
            )}
            <p className="page-subtitle">
              {members.length} member{members.length !== 1 ? 's' : ''} · {group.messages.toLocaleString()} messages · Created {group.created}
            </p>
          </div>
        </div>
        <div className="flex gap-8">
          <button className="btn btn-secondary" onClick={() => setModal('chat')}>
            <MessagesSquare size={14} /> View chats
          </button>
          <button className="btn btn-secondary" onClick={() => setModal('edit')}>
            <Pencil size={14} /> Edit
          </button>
          <button className="btn btn-danger" onClick={() => setModal('delete')}>
            <Trash2 size={14} /> Delete group
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="card">
          <div className="card-header">
            <h3>Members ({members.length})</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setModal('addMember')}>
              <UserPlus size={13} /> Add
            </button>
          </div>
          <div style={{ padding: '6px 0' }}>
            {members.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px 20px' }}>No members yet.</div>
            ) : (
              members.map((m) => (
                <div key={m.id} className="member-row">
                  <Avatar initials={m.initials} color={m.color} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.name}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {m.id === group.createdBy ? 'Group admin' : m.role}
                    </div>
                  </div>
                  {m.id !== group.createdBy && (
                    <button
                      className="btn btn-ghost btn-icon"
                      title={`Remove ${m.name}`}
                      onClick={() => setModal({ type: 'removeMember', userId: m.id, userName: m.name })}
                    >
                      <UserMinus size={15} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ marginTop: 0, marginBottom: 18, fontSize: 15 }}>Group permissions</h3>

          {[
            { key: 'whoCanAddMembers', label: 'Who can add members' },
            { key: 'whoCanSendMessages', label: 'Who can send messages' },
            { key: 'whoCanShareFiles', label: 'Who can share files' },
          ].map((p) => (
            <div className="field" key={p.key}>
              <label>{p.label}</label>
              <select
                className="select"
                value={permissions[p.key]}
                onChange={(e) => setPermissions((prev) => ({ ...prev, [p.key]: e.target.value }))}
              >
                {PERMISSION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          <button
            className="btn btn-primary"
            style={{ marginTop: 8 }}
            onClick={handleSavePermissions}
          >
            {saved ? 'Saved' : 'Save permissions'}
          </button>
        </div>
      </div>

      {/* Modals */}
      {modal === 'delete' && (
        <ConfirmModal
          title="Delete group"
          message={`Are you sure you want to delete "${group.name}"? All messages and settings will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete group"
          onConfirm={handleDelete}
          onClose={closeModal}
        />
      )}

      {modal === 'addMember' && (
        <AddMemberModal
          group={group}
          allUsers={users}
          onAdd={addMember}
          onClose={closeModal}
        />
      )}

      {modal === 'chat' && (
        <GroupChatModal
          group={group}
          findUser={findUser}
          onClose={closeModal}
        />
      )}

      {modal === 'edit' && (
        <CreateGroupModal
          users={users}
          existingGroup={group}
          onSave={(data) => updateGroup(id, data)}
          onClose={closeModal}
        />
      )}

      {modal?.type === 'removeMember' && (
        <ConfirmModal
          title="Remove member"
          message={`Remove ${modal.userName} from "${group.name}"? They will lose access to the group's messages.`}
          confirmLabel="Remove"
          onConfirm={() => handleRemoveMember(modal.userId)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
