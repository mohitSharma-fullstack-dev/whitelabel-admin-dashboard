import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MessageSquare, Users2, Pencil, Trash2, MessagesSquare } from 'lucide-react';
import Avatar from '../components/Avatar';
import DropdownMenu from '../components/DropdownMenu';
import CreateGroupModal from '../components/CreateGroupModal';
import GroupChatModal from '../components/GroupChatModal';
import ConfirmModal from '../components/ConfirmModal';
import { useGroups } from '../context/GroupsContext';
import { useUsers } from '../context/UsersContext';

export default function Groups() {
  const navigate = useNavigate();
  const { groups, createGroup, updateGroup, deleteGroup } = useGroups();
  const { users, findUser } = useUsers();

  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null); // { type: 'create'|'edit'|'chat'|'delete', group? }

  const filtered = groups.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()));

  const closeModal = () => setModal(null);

  const handleCreate = (data) => { createGroup(data); };

  const handleEdit = (data) => { updateGroup(modal.group.id, data); };

  const handleDelete = () => { deleteGroup(modal.group.id); };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Groups</h1>
          <p className="page-subtitle">{groups.length} chat group{groups.length !== 1 ? 's' : ''} in your workspace.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ type: 'create' })}>
          <Plus size={15} /> Create group
        </button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={15} className="muted" />
          <input
            placeholder="Search groups"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="group-grid">
        {filtered.map((g) => {
          const creator = findUser(g.createdBy);
          return (
            <div
              key={g.id}
              className="card card-pad group-card"
              onClick={() => navigate(`/groups/${g.id}`)}
            >
              <div className="group-card-header">
                <div className="flex items-center gap-12" style={{ flex: 1, minWidth: 0 }}>
                  <Avatar initials={g.initials} color={g.color} size={42} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{g.name}</div>
                    <div className="muted" style={{ fontSize: 12.5 }}>Created by {creator?.name || 'Unknown'}</div>
                    {g.description && (
                      <div className="muted" style={{ fontSize: 12, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {g.description}
                      </div>
                    )}
                  </div>
                </div>
                <DropdownMenu
                  items={[
                    {
                      label: 'View chats',
                      icon: MessagesSquare,
                      onClick: () => setModal({ type: 'chat', group: g }),
                    },
                    {
                      label: 'Edit group',
                      icon: Pencil,
                      onClick: () => setModal({ type: 'edit', group: g }),
                    },
                    { divider: true, key: 'sep' },
                    {
                      label: 'Delete group',
                      icon: Trash2,
                      danger: true,
                      onClick: () => setModal({ type: 'delete', group: g }),
                    },
                  ]}
                />
              </div>
              <div className="group-card-stats">
                <span><Users2 size={13} /> {g.memberIds.length} member{g.memberIds.length !== 1 ? 's' : ''}</span>
                <span><MessageSquare size={13} /> {g.messages.toLocaleString()} messages</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            {query ? `No groups match "${query}".` : 'No groups yet. Create one to get started.'}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.type === 'create' && (
        <CreateGroupModal
          users={users}
          onSave={handleCreate}
          onClose={closeModal}
        />
      )}

      {modal?.type === 'edit' && (
        <CreateGroupModal
          users={users}
          existingGroup={modal.group}
          onSave={handleEdit}
          onClose={closeModal}
        />
      )}

      {modal?.type === 'chat' && (
        <GroupChatModal
          group={modal.group}
          findUser={findUser}
          onClose={closeModal}
        />
      )}

      {modal?.type === 'delete' && (
        <ConfirmModal
          title="Delete group"
          message={`Are you sure you want to delete "${modal.group.name}"? All messages and settings for this group will be permanently removed.`}
          confirmLabel="Delete group"
          onConfirm={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
