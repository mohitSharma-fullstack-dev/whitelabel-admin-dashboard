export default function PhonePreview({ config }) {
  const { appName, tagline, logoInitial, colors } = config;

  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        {/* Splash-style header */}
        <div className="phone-hero" style={{ background: colors.primary }}>
          <div className="phone-logo">{logoInitial || appName.charAt(0)}</div>
          <div className="phone-app-name">{appName}</div>
          <div className="phone-tagline">{tagline}</div>
        </div>

        {/* Chat list preview */}
        <div className="phone-body">
          {[
            { name: 'Ananya Kapoor', msg: 'On it, one sec', unread: 2, color: '#E0523F' },
            { name: 'Product Team', msg: '📷 Photo', unread: 5, color: '#3D5AFE' },
            { name: 'Sofia Torres', msg: 'Tomorrow though!', unread: 0, color: colors.accent },
          ].map((row) => (
            <div className="phone-chat-row" key={row.name}>
              <div className="phone-avatar" style={{ background: row.color }}>
                {row.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </div>
              <div className="phone-chat-text">
                <div className="phone-chat-name">{row.name}</div>
                <div className="phone-chat-msg">{row.msg}</div>
              </div>
              {row.unread > 0 && (
                <div className="phone-badge" style={{ background: colors.accent }}>{row.unread}</div>
              )}
            </div>
          ))}
        </div>

        {/* Bubble preview */}
        <div className="phone-bubbles">
          <div className="phone-bubble incoming">Hey! Did you see the notes?</div>
          <div className="phone-bubble outgoing" style={{ background: colors.primary }}>
            Sending now 👍
          </div>
        </div>

        {/* Tab bar */}
        <div className="phone-tabbar">
          <div className="phone-tab active" style={{ color: colors.primary }}>Chats</div>
          <div className="phone-tab">Profile</div>
        </div>
      </div>
    </div>
  );
}
