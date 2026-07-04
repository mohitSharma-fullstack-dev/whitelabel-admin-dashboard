import { useState } from 'react';
import { MessageCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';

export default function Login() {
  const { signIn } = useAuth();
  const { config } = useConfig();
  const [email, setEmail] = useState('ravi.menon@nimbus.app');
  const [password, setPassword] = useState('');
  const [hide, setHide] = useState(true);

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-logo" style={{ background: config.colors.primary }}>
          <MessageCircle size={20} color="#fff" />
        </div>
        <h1 className="login-title">{config.appName} Admin</h1>
        <p className="login-subtitle">Sign in to manage your workspace.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          <div className="field">
            <label>Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={hide ? 'password' : 'text'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingRight: 38 }}
              />
              <button
                type="button"
                onClick={() => setHide(!hide)}
                className="password-toggle"
                aria-label="Toggle password visibility"
              >
                {hide ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '11px 0', marginTop: 6 }}>
            Log in
          </button>
        </form>

        <p className="login-footnote">
          This is a static demo — any email and password will sign you in.
        </p>
      </div>
    </div>
  );
}
