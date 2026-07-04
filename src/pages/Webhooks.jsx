import { useState } from 'react';
import { Plus, Copy, Trash2, RefreshCw, X } from 'lucide-react';
import { webhooks as initialWebhooks, webhookEvents } from '../data/webhooks';

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState(initialWebhooks);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const toggleEvent = (evt) => {
    setSelectedEvents((prev) => (prev.includes(evt) ? prev.filter((e) => e !== evt) : [...prev, evt]));
  };

  const toggleStatus = (id) => {
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: w.status === 'active' ? 'disabled' : 'active' } : w))
    );
  };

  const removeWebhook = (id) => setWebhooks((prev) => prev.filter((w) => w.id !== id));

  const addWebhook = () => {
    if (!name.trim() || !url.trim() || selectedEvents.length === 0) return;
    setWebhooks((prev) => [
      ...prev,
      {
        id: `w${Date.now()}`,
        name: name.trim(),
        url: url.trim(),
        events: selectedEvents,
        status: 'active',
        lastTriggered: 'Never',
        secret: `whsec_${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`,
      },
    ]);
    setName('');
    setUrl('');
    setSelectedEvents([]);
    setShowForm(false);
  };

  const copySecret = (w) => {
    setCopiedId(w.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Webhooks</h1>
          <p className="page-subtitle">
            Notify external services when events happen in your workspace. No code runs here yet —
            this is the configuration surface the Node API will read from.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add webhook</>}
        </button>
      </div>

      {showForm && (
        <div className="card card-pad" style={{ marginBottom: 20 }}>
          <div className="row-2">
            <div className="field">
              <label>Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. CRM sync" />
            </div>
            <div className="field">
              <label>Endpoint URL</label>
              <input
                className="input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-service.com/webhook"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
              />
            </div>
          </div>
          <div className="field">
            <label>Trigger on</label>
            <div className="event-chip-row">
              {webhookEvents.map((evt) => (
                <button
                  key={evt}
                  className={`event-chip${selectedEvents.includes(evt) ? ' active' : ''}`}
                  onClick={() => toggleEvent(evt)}
                >
                  {evt}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={addWebhook}>Create webhook</button>
        </div>
      )}

      <div className="webhook-list">
        {webhooks.map((w) => (
          <div className="card card-pad webhook-card" key={w.id}>
            <div className="flex justify-between items-center" style={{ marginBottom: 10 }}>
              <div className="flex items-center gap-12">
                <span style={{ fontWeight: 700, fontSize: 14.5 }}>{w.name}</span>
                <span className={`badge ${w.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                  {w.status === 'active' ? 'Active' : 'Disabled'}
                </span>
              </div>
              <div className="flex gap-8">
                <button className="btn btn-ghost btn-icon" onClick={() => toggleStatus(w.id)} title="Toggle status">
                  <RefreshCw size={15} />
                </button>
                <button className="btn btn-ghost btn-icon" onClick={() => removeWebhook(w.id)} title="Delete webhook">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="webhook-url">{w.url}</div>

            <div className="event-chip-row" style={{ marginTop: 10 }}>
              {w.events.map((e) => (
                <span key={e} className="event-chip static">{e}</span>
              ))}
            </div>

            <div className="webhook-footer">
              <span className="muted">Last triggered {w.lastTriggered}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => copySecret(w)}>
                <Copy size={12} /> {copiedId === w.id ? 'Copied secret' : w.secret}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
