import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../../services/api';
import { t } from '../../i18n/i18n';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

function ViewEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fullscreenImg, setFullscreenImg] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventsAPI.getAll();
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderMedia = (event) => {
    if (!event.image) return null;
    const lower = event.image.toLowerCase();
    const src = `${API_BASE}${event.image}`;
    if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg') || lower.endsWith('.mov')) {
      return (
        <div className="media-thumb">
          <video className="media-content" controls preload="metadata">
            <source src={src} type="video/mp4" />
          </video>
        </div>
      );
    }
    return <img className="event-img" src={src} alt={event.title} style={{ cursor: 'pointer' }} onClick={() => setFullscreenImg(src)} />;
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="page-header-modern">
        <h2>{t('events.title')}</h2>
        <span style={{ color: 'var(--gray-400)', fontSize: 14 }}>{filtered.length} event{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="search-bar-modern">
        <div className="search-input-wrapper">
          <span className="search-icon">{'\u{1F50D}'}</span>
          <input
            className="search-input-modern"
            type="text"
            placeholder={t('events.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-modern">{t('events.loading')}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{'\u{1F4C5}'}</div>
          <h3>{t('events.noEventsFound')}</h3>
          <p>{events.length === 0 ? t('events.noEventsYet') : t('events.tryDifferent')}</p>
        </div>
      ) : (
        <div className="event-grid-modern">
          {filtered.map((event) => (
            <article className="event-card-modern" key={event.event_id}>
              {renderMedia(event)}
              <div className="event-card-body">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div className="event-meta">
                  <span>{'\u{1F4C5}'}</span>
                  <span>
                    {new Date(event.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                    {event.created_by_name && ` by ${event.created_by_name}`}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {fullscreenImg && (
        <div className="modal-overlay-modern" onClick={() => setFullscreenImg(null)} style={{ cursor: 'zoom-out' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '95vw', maxHeight: '95vh' }}>
            <img src={fullscreenImg} alt="Full screen" style={{ maxWidth: '100%', maxHeight: '95vh', borderRadius: 8, boxShadow: '0 0 40px rgba(0,0,0,0.5)', display: 'block' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewEvents;
