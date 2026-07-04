import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus } from 'lucide-react';
import Avatar from '../components/Avatar';
import InviteUserModal from '../components/InviteUserModal';
import { useUsers } from '../context/UsersContext';

const STATUS_BADGE = {
  active: { cls: 'badge-success', label: 'Active' },
  suspended: { cls: 'badge-danger', label: 'Suspended' },
  invited: { cls: 'badge-warning', label: 'Invited' },
};

export default function Users() {
  const navigate = useNavigate();
  const { users, inviteUser } = useUsers();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInvite, setShowInvite] = useState(false);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesQuery =
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [users, query, statusFilter]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{users.length} people across your workspace.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowInvite(true)}>
          <UserPlus size={15} /> Invite user
        </button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={15} className="muted" />
          <input
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="select"
          style={{ width: 160 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="invited">Invited</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last active</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="clickable" onClick={() => navigate(`/users/${u.id}`)}>
                  <td>
                    <div className="flex items-center gap-12">
                      <Avatar initials={u.initials} color={u.color} size={32} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div className="muted" style={{ fontSize: 12.5 }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.role}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[u.status].cls}`}>
                      <span className="badge-dot" style={{ background: 'currentColor' }} />
                      {STATUS_BADGE[u.status].label}
                    </span>
                  </td>
                  <td className="muted">{u.lastActive}</td>
                  <td className="muted">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              {query ? `No users match "${query}".` : 'No users found.'}
            </div>
          )}
        </div>
      </div>

      {showInvite && (
        <InviteUserModal
          onInvite={inviteUser}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}
