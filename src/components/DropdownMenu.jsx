import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export default function DropdownMenu({ items, triggerClassName = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className={`dropdown ${triggerClassName}`} ref={ref}>
      <button
        className="btn btn-ghost btn-icon"
        onClick={(e) => { e.stopPropagation(); setOpen((s) => !s); }}
        aria-label="More actions"
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div className="dropdown-menu">
          {items.map((item) =>
            item.divider ? (
              <div key={item.key} className="dropdown-divider" />
            ) : (
              <button
                key={item.label}
                className={`dropdown-item${item.danger ? ' danger' : ''}`}
                onClick={(e) => { e.stopPropagation(); setOpen(false); item.onClick(); }}
              >
                {item.icon && <item.icon size={14} />}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
