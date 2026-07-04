import { useEffect, useRef } from 'react';
import { Eye } from 'lucide-react';
import Modal from './Modal';
import Avatar from './Avatar';
import { chats } from '../data/chats';

function extractDay(ts) {
  if (!ts) return null;
  // Timestamps like "Mon 9:00 AM", "Fri 5:15 PM", "Next day 9:00 AM", "Sat 3:00 AM", "Tuesday 3:30 PM"
  const dayPrefixes = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    'Next day', 'Today'];
  for (const prefix of dayPrefixes) {
    if (ts.startsWith(prefix + ' ')) return prefix;
  }
  return 'Today';
}

function stripDay(ts) {
  const dayPrefixes = ['Next day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (const prefix of dayPrefixes) {
    if (ts.startsWith(prefix + ' ')) return ts.slice(prefix.length + 1);
  }
  return ts;
}

export default function GroupChatModal({ group, findUser, onClose }) {
  const messages = chats[group.id] || [];
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, []);

  // Group messages by day
  const sections = [];
  let currentDay = null;
  for (const msg of messages) {
    const day = extractDay(msg.ts);
    if (day !== currentDay) {
      currentDay = day;
      sections.push({ type: 'divider', label: day === 'Today' ? 'Today' : day });
    }
    sections.push({ type: 'msg', msg });
  }

  return (
    <Modal title={`${group.name} — Chat history`} onClose={onClose} width={640}>
      <div className="chat-view" style={{ height: 560 }}>
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state" style={{ paddingTop: 80 }}>No messages in this group yet.</div>
          ) : (
            <>
              {sections.map((item, i) =>
                item.type === 'divider' ? (
                  <div className="chat-date-divider" key={`div-${i}`}>{item.label}</div>
                ) : (
                  <ChatMessage key={item.msg.id} msg={item.msg} findUser={findUser} />
                )
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>
        <div className="chat-readonly-bar">
          <Eye size={14} />
          Admin read-only view &nbsp;·&nbsp; {messages.length} message{messages.length !== 1 ? 's' : ''} &nbsp;·&nbsp; {group.memberIds.length} member{group.memberIds.length !== 1 ? 's' : ''}
        </div>
      </div>
    </Modal>
  );
}

function ChatMessage({ msg, findUser }) {
  const user = findUser(msg.userId);
  const timeDisplay = stripDay(msg.ts);
  return (
    <div className="chat-msg-row">
      <Avatar
        initials={user?.initials || '?'}
        color={user?.color || '#9AA3A8'}
        size={32}
      />
      <div className="chat-msg-bubble">
        <div className="chat-msg-sender" style={{ color: user?.color || 'var(--color-text)' }}>
          {user?.name || 'Unknown user'}
        </div>
        <div className="chat-msg-text">{msg.text}</div>
        <div className="chat-msg-ts">{timeDisplay}</div>
      </div>
    </div>
  );
}
