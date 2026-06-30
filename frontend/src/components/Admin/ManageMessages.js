import React, { useState, useEffect } from 'react';
import { contactAPI } from '../../services/api';
import { t } from '../../i18n/i18n';

function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await contactAPI.getAll();
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await contactAPI.markRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.message_id === id ? { ...m, is_read: 1 } : m))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="page-header-modern">
        <h2>{t('admin.messages.title')}</h2>
        <p style={{ color: 'var(--gray-400)', fontSize: 14, marginTop: 4 }}>
          {messages.length} {t('admin.messages.total')}
          {unreadCount > 0 && ` \u00B7 ${unreadCount} ${t('admin.messages.unread')}`}
        </p>
      </div>

      {loading ? (
        <div className="loading-modern">{t('admin.messages.loading')}</div>
      ) : messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{'\u{1F4EC}'}</div>
          <h3>{t('admin.messages.noMessages')}</h3>
          <p>{t('admin.messages.noMessagesDesc')}</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <div
              key={msg.message_id}
              className={`card-modern ${!msg.is_read ? 'card-unread' : ''}`}
              style={{ marginBottom: 12, padding: 20, borderLeft: !msg.is_read ? '4px solid var(--primary)' : '4px solid transparent' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <strong style={{ fontSize: 16 }}>{msg.name}</strong>
                  <span style={{ marginLeft: 12, color: 'var(--gray-400)', fontSize: 13 }}>{msg.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                    {new Date(msg.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                    {!msg.is_read && (
                    <button className="btn-modern btn-modern-sm btn-modern-outline" onClick={() => handleMarkRead(msg.message_id)}>
                      {t('admin.messages.markRead')}
                    </button>
                  )}
                </div>
              </div>
              <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageMessages;
