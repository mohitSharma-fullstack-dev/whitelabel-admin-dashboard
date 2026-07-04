import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UsersRound,
  ShieldCheck,
  Palette,
  Webhook,
  Settings,
  LogOut,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import Avatar from './Avatar';

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/groups', label: 'Groups', icon: UsersRound },
  { to: '/roles', label: 'Roles & permissions', icon: ShieldCheck },
];

const CONFIG_NAV = [
  { to: '/branding', label: 'App branding', icon: Palette },
  { to: '/webhooks', label: 'Webhooks', icon: Webhook },
  { to: '/settings', label: 'App settings', icon: Settings },
];

export default function Sidebar() {
  const { admin, signOut } = useAuth();
  const { config } = useConfig();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo" style={{ background: config.colors.primary }}>
          <MessageCircle size={18} color="#fff" />
        </div>
        <div>
          <div className="sidebar-brand-name">{config.appName}</div>
          <div className="sidebar-brand-sub">Admin console</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Workspace</div>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <item.icon size={17} strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}

        <div className="sidebar-section-label">Configure app</div>
        {CONFIG_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <item.icon size={17} strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-admin">
          <Avatar initials={admin.initials} size={32} />
          <div style={{ minWidth: 0 }}>
            <div className="sidebar-admin-name">{admin.name}</div>
            <div className="sidebar-admin-email">{admin.email}</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={signOut} title="Log out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
