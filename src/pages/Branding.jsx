import { useState } from 'react';
import { Check, Image, RotateCcw } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import PhonePreview from '../components/PhonePreview';

const PRESETS = [
  { label: 'Teal (default)', primary: '#1F6F6B', accent: '#FF7A59', success: '#34A876' },
  { label: 'Indigo', primary: '#3730A5', accent: '#F59E0B', success: '#16A34A' },
  { label: 'Rose', primary: '#BE123C', accent: '#0EA5E9', success: '#22C55E' },
  { label: 'Slate', primary: '#1E293B', accent: '#EA580C', success: '#059669' },
];

export default function Branding() {
  const { config, updateConfig, updateColors, save, savedAt } = useConfig();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    save();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">App branding</h1>
          <p className="page-subtitle">
            Changes here update the mobile app's look instantly — no code changes or app store
            resubmission needed for colors and copy.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? <><Check size={15} /> Saved</> : 'Save & publish'}
        </button>
      </div>

      <div className="branding-layout">
        <div className="branding-form">
          <div className="card card-pad">
            <h3 style={{ marginTop: 0, marginBottom: 18, fontSize: 15 }}>Identity</h3>

            <div className="field">
              <label>App name</label>
              <input
                className="input"
                value={config.appName}
                onChange={(e) => updateConfig({ appName: e.target.value })}
              />
              <div className="hint">Shown on the splash screen, login page, and app store listing.</div>
            </div>

            <div className="field">
              <label>Tagline</label>
              <input
                className="input"
                value={config.tagline}
                onChange={(e) => updateConfig({ tagline: e.target.value })}
              />
            </div>

            <div className="row-2">
              <div className="field">
                <label>Logo initial (fallback)</label>
                <input
                  className="input"
                  maxLength={1}
                  value={config.logoInitial}
                  onChange={(e) => updateConfig({ logoInitial: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="field">
                <label>Logo image</label>
                <button className="btn btn-secondary" style={{ width: '100%' }}>
                  <Image size={14} /> Upload logo
                </button>
              </div>
            </div>
          </div>

          <div className="card card-pad">
            <div className="flex justify-between items-center" style={{ marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>Color palette</h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => updateColors(PRESETS[0])}
              >
                <RotateCcw size={13} /> Reset to default
              </button>
            </div>

            <div className="preset-row">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  className={`preset-swatch${config.colors.primary === p.primary ? ' active' : ''}`}
                  onClick={() => updateColors({ primary: p.primary, accent: p.accent, success: p.success })}
                  title={p.label}
                >
                  <span style={{ background: p.primary }} />
                  <span style={{ background: p.accent }} />
                </button>
              ))}
            </div>

            <div className="color-field-grid">
              <ColorField
                label="Primary"
                hint="Headers, buttons, sent messages"
                value={config.colors.primary}
                onChange={(v) => updateColors({ primary: v })}
              />
              <ColorField
                label="Accent"
                hint="Unread badges, CTAs"
                value={config.colors.accent}
                onChange={(v) => updateColors({ accent: v })}
              />
              <ColorField
                label="Success"
                hint="Online status, read receipts"
                value={config.colors.success}
                onChange={(v) => updateColors({ success: v })}
              />
            </div>
          </div>

          {savedAt && (
            <p className="muted" style={{ fontSize: 12 }}>
              Last published {savedAt.toLocaleTimeString()}. In production this triggers the{' '}
              <code>branding.updated</code> webhook event so connected apps stay in sync.
            </p>
          )}
        </div>

        <PhonePreview config={config} />
      </div>
    </div>
  );
}

function ColorField({ label, hint, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="color-input-row">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="color-swatch-input"
        />
        <input
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
        />
      </div>
      <div className="hint">{hint}</div>
    </div>
  );
}
