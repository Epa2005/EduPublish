import React, { useState, useEffect } from 'react';
import { notesAPI, eventsAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const hours = new Date().getHours();
const greeting = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';

const statCards = [
  { key: 'myNotes', icon: '\u{1F4C4}', label: 'My Notes', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  { key: 'totalEvents', icon: '\u{1F4C5}', label: 'School Events', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
];

const quickActions = [
  { to: '/teacher/notes', icon: '\u{1F4C4}', label: 'Upload Notes', desc: 'Share learning materials with students' },
  { to: '/events', icon: '\u{1F4C5}', label: 'View Events', desc: 'Browse school events and activities' },
  { to: '/notes', icon: '\u{1F4DA}', label: 'Study Notes', desc: 'View all available study materials' },
];

function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ myNotes: 0, totalEvents: 0 });
  const [recentNotes, setRecentNotes] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    setUser(u);
    const fetchData = async () => {
      try {
        const [notesRes, eventsRes] = await Promise.all([
          notesAPI.getMyNotes(),
          eventsAPI.getAll(),
        ]);
        setStats({ myNotes: notesRes.data.length, totalEvents: eventsRes.data.length });
        setRecentNotes(notesRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>{greeting}, {user?.full_name || 'Teacher'}</h1>
          <p>Manage your notes and stay updated with school events.</p>
        </div>
        <div className="dashboard-date">
          <span className="dash-date-icon">{'\u{1F4C5}'}</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="dash-stats-grid">
        {statCards.map((s) => (
          <div key={s.key} className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: s.bg, color: s.color }}>
              <span>{s.icon}</span>
            </div>
            <div className="dash-stat-info">
              <span className="dash-stat-number">{stats[s.key]}</span>
              <span className="dash-stat-label">{s.label}</span>
            </div>
            <div className="dash-stat-trend" style={{ background: s.bg, color: s.color }}>
              Active
            </div>
          </div>
        ))}
      </div>

      <div className="dash-two-col">
        <div className="dash-card">
          <div className="dash-card-header">
            <h3><span className="dash-card-icon">{'\u{26A1}'}</span> Quick Actions</h3>
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
            <h3><span className="dash-card-icon">{'\u{1F4C4}'}</span> My Recent Notes</h3>
            <Link to="/teacher/notes" className="dash-view-link">View all {'\u2192'}</Link>
          </div>
          {recentNotes.length === 0 ? (
            <div className="dash-empty">You haven't uploaded any notes yet.</div>
          ) : (
            <div className="dash-list">
              {recentNotes.map((note) => (
                <div className="dash-list-item" key={note.note_id}>
                  <div className="dash-list-dot" style={{ background: '#10b981' }} />
                  <div className="dash-list-content">
                    <strong>{note.title}</strong>
                    <span>{note.subject} &middot; {new Date(note.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
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

export default TeacherDashboard;
