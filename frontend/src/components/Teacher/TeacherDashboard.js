import React, { useState, useEffect } from 'react';
import { notesAPI, eventsAPI } from '../../services/api';
import { Link } from 'react-router-dom';

function TeacherDashboard() {
  const [stats, setStats] = useState({ myNotes: 0, totalEvents: 0 });
  const [recentNotes, setRecentNotes] = useState([]);

  useEffect(() => {
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
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="page-header-modern">
        <h2>Teacher Dashboard</h2>
      </div>
      <div className="stats-grid-admin">
        <div className="stat-card-admin">
          <div className="stat-icon">&#x1F4C4;</div>
          <div className="stat-number">{stats.myNotes}</div>
          <div className="stat-label">My Notes</div>
        </div>
        <div className="stat-card-admin">
          <div className="stat-icon">&#x1F4C5;</div>
          <div className="stat-number">{stats.totalEvents}</div>
          <div className="stat-label">School Events</div>
        </div>
      </div>
      <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
        <Link to="/teacher/notes" className="btn-modern btn-modern-outline">Upload Notes</Link>
        <Link to="/events" className="btn-modern btn-modern-outline">View Events</Link>
      </div>
      <div className="card-modern">
        <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 700 }}>My Recent Notes</h3>
        {recentNotes.length === 0 ? (
          <p style={{ color: '#64748b' }}>You haven't uploaded any notes yet.</p>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {recentNotes.map((note) => (
                <tr key={note.note_id}>
                  <td>{note.title}</td>
                  <td>{note.subject}</td>
                  <td>{new Date(note.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;
