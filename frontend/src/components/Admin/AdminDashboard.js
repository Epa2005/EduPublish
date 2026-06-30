import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, eventsAPI, notesAPI, contactAPI } from '../../services/api';
import { t } from '../../i18n/i18n';

const hours = new Date().getHours();
const greeting = hours < 12 ? t('admin.dashboard.greetingMorning') : hours < 18 ? t('admin.dashboard.greetingAfternoon') : t('admin.dashboard.greetingEvening');

const statCards = [
  { key: 'teachers', icon: '\u{1F393}', label: t('admin.dashboard.teachers'), color: '#0d9488', bg: 'rgba(13,148,136,0.1)' },
  { key: 'events', icon: '\u{1F4C5}', label: t('admin.dashboard.events'), color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { key: 'notes', icon: '\u{1F4DA}', label: t('admin.dashboard.notes'), color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { key: 'messages', icon: '\u{1F4EC}', label: t('admin.dashboard.messages'), color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
];

const quickActions = [
  { to: '/admin/teachers', icon: '\u{1F465}', label: t('admin.dashboard.manageTeachers'), desc: t('admin.dashboard.manageTeachersDesc') },
  { to: '/admin/events', icon: '\u{1F4C5}', label: t('admin.dashboard.manageEvents'), desc: t('admin.dashboard.manageEventsDesc') },
  { to: '/admin/announcements', icon: '\u{1F4E2}', label: t('admin.dashboard.announcements'), desc: t('admin.dashboard.announcementsDesc') },
  { to: '/admin/messages', icon: '\u{1F4ED}', label: t('admin.dashboard.messagesLabel'), desc: t('admin.dashboard.messagesDesc') },
  { to: '/admin/staff', icon: '\u{1F465}', label: t('admin.dashboard.manageStaff'), desc: t('admin.dashboard.manageStaffDesc') },
];

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ teachers: 0, events: 0, notes: 0, messages: 0 });
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    setUser(u);
    const fetchStats = async () => {
      try {
        const [teachersRes, eventsRes, notesRes, messagesRes] = await Promise.all([
          adminAPI.getTeachers(),
          eventsAPI.getAll(),
          notesAPI.getAll(),
          contactAPI.getAll(),
        ]);
        setStats({
          teachers: teachersRes.data.length,
          events: eventsRes.data.length,
          notes: notesRes.data.length,
          messages: messagesRes.data.filter((m) => !m.is_read).length,
        });
        setRecentEvents(eventsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>{greeting}, {user?.full_name || 'Admin'}</h1>
          <p>{t('admin.dashboard.subtitle')}</p>
        </div>
        <div className="dashboard-date">
          <span className="dash-date-icon">{'\u{1F4C5}'}</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="dash-stats-grid">
        {statCards.map((s) => (
          <Link key={s.key} to={s.key === 'messages' ? '/admin/messages' : '#'} className="dash-stat-card" style={{ textDecoration: 'none' }}>
            <div className="dash-stat-icon" style={{ background: s.bg, color: s.color }}>
              <span>{s.icon}</span>
            </div>
            <div className="dash-stat-info">
              <span className="dash-stat-number">{stats[s.key]}</span>
              <span className="dash-stat-label">{s.label}</span>
            </div>
            <div className="dash-stat-trend" style={{ background: s.bg, color: s.color }}>
              {s.key === 'messages' && stats.messages > 0 ? `${stats.messages} ${t('admin.dashboard.unread')}` : t('admin.dashboard.viewAll')}
            </div>
          </Link>
        ))}
      </div>

      <div className="dash-two-col">
        <div className="dash-card">
          <div className="dash-card-header">
            <h3><span className="dash-card-icon">{'\u{26A1}'}</span> {t('admin.dashboard.quickActions')}</h3>
          </div>
          <div className="dash-actions-grid">
            {quickActions.map((a) => (
              <Link key={a.to} to={a.to} className="dash-action-card">
                <div className="dash-action-icon">{a.icon}</div>
                <div className="dash-action-info">
                  <strong>{a.label}</strong>
                  <span>{a.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <h3><span className="dash-card-icon">{'\u{1F4C5}'}</span> {t('admin.dashboard.recentEvents')}</h3>
            <Link to="/admin/events" className="dash-view-link">{t('admin.dashboard.viewAllLink')} {'\u2192'}</Link>
          </div>
          {recentEvents.length === 0 ? (
            <div className="dash-empty">{t('admin.dashboard.noEvents')}</div>
          ) : (
            <div className="dash-list">
              {recentEvents.map((event) => (
                <div className="dash-list-item" key={event.event_id}>
                  <div className="dash-list-dot" />
                  <div className="dash-list-content">
                    <strong>{event.title}</strong>
                    <span>{new Date(event.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
