import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, eventsAPI, notesAPI } from '../../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({ teachers: 0, events: 0, notes: 0 });
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [teachersRes, eventsRes, notesRes] = await Promise.all([
          adminAPI.getTeachers(),
          eventsAPI.getAll(),
          notesAPI.getAll(),
        ]);
        console.log('admin stats responses', { teachersRes: teachersRes.data, eventsRes: eventsRes.data?.length, notesRes: notesRes.data?.length });
        setStats({
          teachers: teachersRes.data.length,
          events: eventsRes.data.length,
          notes: notesRes.data.length,
        });
        setRecentEvents(eventsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="page-header-modern">
        <h2>Admin Dashboard</h2>
      </div>
      <div className="stats-grid-admin">
        <div className="stat-card-admin">
          <div className="stat-icon">&#x1F468;&#x200D;&#x1F3EB;</div>
          <div className="stat-number">{stats.teachers}</div>
          <div className="stat-label">Teachers</div>
        </div>
        <div className="stat-card-admin">
          <div className="stat-icon">&#x1F4C5;</div>
          <div className="stat-number">{stats.events}</div>
          <div className="stat-label">Events</div>
        </div>
        <div className="stat-card-admin">
          <div className="stat-icon">&#x1F4DA;</div>
          <div className="stat-number">{stats.notes}</div>
          <div className="stat-label">Notes</div>
        </div>
      </div>
      <div className="card-modern">
        <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 700 }}>Recent Events</h3>
        {recentEvents.length === 0 ? (
          <p style={{ color: '#64748b' }}>No events yet.</p>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr key={event.event_id}>
                  <td>{event.title}</td>
                  <td>{new Date(event.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
        <Link to="/admin/teachers" className="btn-modern btn-modern-outline">Manage Teachers</Link>
        <Link to="/admin/events" className="btn-modern btn-modern-outline">Manage Events</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
