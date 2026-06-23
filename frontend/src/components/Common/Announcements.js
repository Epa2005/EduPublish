import React, { useState, useEffect } from 'react';
import { announcementsAPI } from '../../services/api';
import { t } from '../../i18n/i18n';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await announcementsAPI.getAll();
        setAnnouncements(res.data);
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="page-header-modern">
        <div>
          <h2>{t('home.announcementsTitle')}</h2>
          <p style={{ color: 'var(--gray-400)', fontSize: 14, marginTop: 4 }}>
            {filtered.length} announcement{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
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
          <div className="empty-icon">{'\u{1F4E2}'}</div>
          <h3>{t('home.noAnnouncements')}</h3>
          <p>{announcements.length === 0 ? t('home.noAnnouncementsDesc') : t('events.tryDifferent')}</p>
        </div>
      ) : (
        <div className="announcement-list">
          {filtered.map((ann) => (
            <article className="announcement-card" key={ann.announcement_id}>
              <div className="announcement-badge">{'\u{1F4E2}'} Announcement</div>
              <h3>{ann.title}</h3>
              <p>{ann.body}</p>
              <div className="announcement-meta">
                <span>{'\u{1F464}'} {ann.created_by_name || 'Administration'}</span>
                <span>{'\u{1F4C5}'} {new Date(ann.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Announcements;
