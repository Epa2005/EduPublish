import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI, notesAPI } from '../../services/api';
import { t } from '../../i18n/i18n';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

function Home() {
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState({ events: 0, notes: 0 });
  const [loading, setLoading] = useState(true);
  const [fullscreenImg, setFullscreenImg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, notesRes] = await Promise.all([eventsAPI.getAll(), notesAPI.getAll()]);
        setEvents(eventsRes.data.slice(0, 3));
        setNotes(notesRes.data.slice(0, 4));
        setStats({ events: eventsRes.data.length, notes: notesRes.data.length });
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderEventMedia = (event) => {
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
    <div>
      <section 
        className="hero-modern hero-image-bg" 
        style={{ 
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.55) 0%, rgba(13, 148, 136, 0.35) 50%, rgba(15, 23, 42, 0.4) 100%), url('/photo.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>
        <div className="container">
          <div className="hero-badge">
            <span>{'\u{1F3C6}'}</span> {t('home.heroBadge')}
          </div>
          <h1>{t('home.heroTitle1')} <span className="gradient-text">{t('home.heroTitleLearning')}</span> {t('home.heroTitleMeets')}<br /><span className="gradient-text">{t('home.heroTitleCommunity')}</span></h1>
          <p>{t('home.heroDesc')}</p>
          <div className="hero-actions">
            <button className="hero-btn-primary" onClick={() => scrollTo('events')}>
              {t('home.browseEvents')}
            </button>
            <button className="hero-btn-secondary" onClick={() => scrollTo('notes')}>
              {t('home.viewNotes')}
            </button>
          </div>
        </div>
      </section>

      {stats.events > 0 || stats.notes > 0 ? (
        <section className="stats-banner reveal-on-scroll">
          <div className="container">
            <div className="stats-grid-banner">
              <div className="stat-item">
                <h3>{stats.events}</h3>
                <p>{t('home.schoolEvents')}</p>
              </div>
              <div className="stat-item">
                <h3>{stats.notes}</h3>
                <p>{t('home.studyNotes')}</p>
              </div>
              <div className="stat-item">
                <h3>{'\u221E'}</h3>
                <p>{t('home.learningOpps')}</p>
              </div>
              <div className="stat-item">
                <h3>24/7</h3>
                <p>{t('home.onlineAccess')}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-modern reveal-on-scroll" id="events">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">{t('home.whatsHappening')}</span>
            <h2>{t('home.eventsTitle')}</h2>
            <p>{t('home.eventsDesc')}</p>
          </div>
          {loading ? (
            <div className="loading-modern">{t('events.loading')}</div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{'\u{1F4C5}'}</div>
              <h3>{t('events.noEventsYet')}</h3>
              <p>{t('events.noEventsYet')}</p>
            </div>
          ) : (
            <div className="event-grid-modern">
              {events.map((event) => (
                <article className="event-card-modern" key={event.event_id}>
                  {renderEventMedia(event)}
                  <div className="event-card-body">
                    <h3>{event.title}</h3>
                    <p>{event.description?.substring(0, 200)}</p>
                    <div className="event-meta">
                      <span>{'\u{1F4C5}'}</span>
                      <span>{new Date(event.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          {events.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link to="/events" className="btn-modern btn-modern-primary">{t('home.viewAllEvents')}</Link>
            </div>
          )}
        </div>
      </section>

      <section className="section-modern section-modern-alt reveal-on-scroll" id="notes">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">{t('home.studyResources')}</span>
            <h2>{t('home.learningMaterials')}</h2>
            <p>{t('home.notesDesc')}</p>
          </div>
          {loading ? (
            <div className="loading-modern">{t('notes.loading')}</div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{'\u{1F4DA}'}</div>
              <h3>{t('notes.noNotesYet')}</h3>
              <p>{t('notes.noNotesYet')}</p>
            </div>
          ) : (
            <div className="notes-grid-modern">
              {notes.map((note) => (
                <div className="note-card-modern" key={note.note_id}>
                  <div className="note-top">
                    <div className="note-thumb">
                      {note.file_url?.toLowerCase().endsWith('.pdf') ? '\u{1F4D5}' : '\u{1F4C4}'}
                    </div>
                    <div className="note-info">
                      <h4>{note.title}</h4>
                      <div className="note-meta">{note.subject} &middot; {note.uploaded_by_name || t('notes.teacher')}</div>
                    </div>
                  </div>
                  <div className="note-meta">{new Date(note.created_at).toLocaleDateString()}</div>
                  <div className="note-actions">
                    <a href={`${API_BASE}${note.file_url}`} className="btn-download" target="_blank" rel="noopener noreferrer">
                      {'\u{1F4E5}'} {t('common.download')}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
          {notes.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link to="/notes" className="btn-modern btn-modern-primary">{t('home.browseAllNotes')}</Link>
            </div>
          )}
        </div>
      </section>

      <section className="section-modern reveal-on-scroll">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">{t('home.forEveryone')}</span>
            <h2>{t('home.whoCanUse')}</h2>
            <p>{t('home.whoCanUseDesc')}</p>
          </div>
          <div className="roles-grid">
            <div className="role-card admin-role">
              <h3>{t('home.admins')}</h3>
              <p>{t('home.adminsDesc')}</p>
            </div>
            <div className="role-card teacher-role">
              <h3>{t('home.teachers')}</h3>
              <p>{t('home.teachersDesc')}</p>
            </div>
            <div className="role-card student-role">
              <h3>{t('home.students')}</h3>
              <p>{t('home.studentsDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section reveal-on-scroll" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">{t('home.stayConnected')}</span>
            <h2>{t('home.questions')}</h2>
            <p>{t('home.questionsDesc')}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-modern btn-modern-primary" style={{ padding: '14px 36px', fontSize: 16 }}>
              {'\u2709'} {t('home.contactUs')}
            </Link>
            <a href="mailto:info@tvtschool.edu.rw" className="btn-modern" style={{ padding: '14px 36px', fontSize: 16, border: '2px solid var(--primary)', color: 'var(--primary)', background: 'transparent' }}>
              {'\u{1F4E7}'} {t('home.emailSupport')}
            </a>
          </div>
        </div>
      </section>

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

export default Home;
