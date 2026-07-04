import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { GroupsProvider } from './context/GroupsContext';
import { UsersProvider } from './context/UsersContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Roles from './pages/Roles';
import Branding from './pages/Branding';
import Webhooks from './pages/Webhooks';
import AppSettings from './pages/AppSettings';

function Gate() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Login />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:id" element={<GroupDetail />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/branding" element={<Branding />} />
        <Route path="/webhooks" element={<Webhooks />} />
        <Route path="/settings" element={<AppSettings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <UsersProvider>
          <GroupsProvider>
            <AuthProvider>
              <Gate />
            </AuthProvider>
          </GroupsProvider>
        </UsersProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}
