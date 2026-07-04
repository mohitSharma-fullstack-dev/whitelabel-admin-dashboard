import { useState } from 'react';
import { Check } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div className="permission-row">
      <div>
        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{title}</div>
        <div className="muted" style={{ fontSize: 12 }}>{desc}</div>
      </div>
      <button className={`switch${checked ? ' on' : ''}`} onClick={onChange} aria-label={`Toggle ${title}`}>
        <span className="knob" />
      </button>
    </div>
  );
}

export default function AppSettings() {
  const { config, updateFeatures } = useConfig();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">App settings</h1>
          <p className="page-subtitle">Feature flags and limits enforced across the mobile app.</p>
        </div>
      </div>

      <div className="settings-stack">
        <div className="card card-pad">
          <h3 style={{ marginTop: 0, marginBottom: 4, fontSize: 15 }}>Security</h3>
          <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
            Best-practice defaults for a chat app handling private conversations.
          </p>
          <div className="permission-list">
            <ToggleRow
              title="End-to-end encryption"
              desc="Messages are encrypted in transit and at rest between devices."
              checked={config.features.endToEndEncryption}
              onChange={() => updateFeatures({ endToEndEncryption: !config.features.endToEndEncryption })}
            />
            <ToggleRow
              title="Read receipts"
              desc="Let senders see when their message has been read."
              checked={config.features.readReceipts}
              onChange={() => updateFeatures({ readReceipts: !config.features.readReceipts })}
            />
            <ToggleRow
              title="Typing indicators"
              desc="Show 'typing…' while the other person is composing a reply."
              checked={config.features.typingIndicators}
              onChange={() => updateFeatures({ typingIndicators: !config.features.typingIndicators })}
            />
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ marginTop: 0, marginBottom: 4, fontSize: 15 }}>File sharing</h3>
          <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
            Controls for photo and file attachments sent in chats.
          </p>
          <div className="permission-list">
            <ToggleRow
              title="Allow file sharing"
              desc="Members can attach photos and documents to messages."
              checked={config.features.fileSharing}
              onChange={() => updateFeatures({ fileSharing: !config.features.fileSharing })}
            />
          </div>
          <div className="field" style={{ marginTop: 16 }}>
            <label>Max file size (MB)</label>
            <input
              type="number"
              className="input"
              style={{ maxWidth: 160 }}
              value={config.features.maxFileUploadMb}
              onChange={(e) => updateFeatures({ maxFileUploadMb: Number(e.target.value) })}
              min={1}
              max={500}
            />
            <div className="hint">Applies to individual photo and file attachments.</div>
          </div>
        </div>

        <div>
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? <><Check size={15} /> Saved</> : 'Save settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
