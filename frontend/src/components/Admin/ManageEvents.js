import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../../services/api';

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', image: null });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await eventsAPI.getAll();
      setEvents(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch events.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    if (form.image) formData.append('image', form.image);
    try {
      if (editing) {
        await eventsAPI.update(editing.event_id, formData);
        setMessage({ type: 'success', text: 'Event updated.' });
      } else {
        await eventsAPI.create(formData);
        setMessage({ type: 'success', text: 'Event created.' });
      }
      setShowModal(false);
      setEditing(null);
      setForm({ title: '', description: '', image: null });
      fetchEvents();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await eventsAPI.delete(id);
      setMessage({ type: 'success', text: 'Event deleted.' });
      fetchEvents();
    } catch (err) {
      setMessage({ type: 'error', text: 'Delete failed.' });
    }
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({ title: event.title, description: event.description || '', image: null });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', image: null });
    setShowModal(true);
  };

  const renderMedia = (mediaPath) => {
    if (!mediaPath) return null;
    const lower = mediaPath.toLowerCase();
    const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
    const src = `${base}${mediaPath}`;
    if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg') || lower.endsWith('.mov')) {
      return (
        <div className="media-card">
          <div className="media-wrapper">
            <video className="media-content" controls>
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="media-overlay">Video</div>
          </div>
        </div>
      );
    }
    return (
      <div className="media-card">
        <div className="media-wrapper">
          <img className="media-content" src={src} alt="event media" />
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="page-header-modern">
        <h2>Manage Events</h2>
        <button className="btn-modern btn-modern-primary" onClick={openCreate}>
          &#x2795; Create Event
        </button>
      </div>
      {message.text && (
        <div className={`alert-modern alert-modern-${message.type}`}>{message.text}</div>
      )}
      {loading ? (
        <div className="loading-modern">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">&#x1F4C5;</div>
          <h3>No events</h3>
          <p>Create your first event to publish on the school website.</p>
        </div>
      ) : (
        <div className="event-grid-modern">
          {events.map((event) => (
            <div className="media-list-card event-card-modern" key={event.event_id}>
              {event.image ? (
                <div className="media-thumb">
                  {event.image.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) ? (
                    <video className="media-content" controls>
                      <source src={`${(process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')}${event.image}`} type="video/mp4" />
                    </video>
                  ) : (
                    <img className="media-content" src={`${(process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')}${event.image}`} alt="event media" />
                  )}
                </div>
              ) : null}
              <div className="card-body-with-media event-card-body">
                <h3>{event.title}</h3>
                <p>{event.description?.substring(0, 120)}</p>
                <div className="event-meta" style={{ marginBottom: 16 }}>
                  <span>&#x1F4C5;</span>
                  <span>{new Date(event.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <button className="btn-modern btn-modern-warning" style={{ marginRight: 8, padding: '6px 14px', fontSize: 13 }}
                    onClick={() => openEdit(event)}>Edit</button>
                  <button className="btn-modern btn-modern-danger" style={{ padding: '6px 14px', fontSize: 13 }}
                    onClick={() => handleDelete(event.event_id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay-modern" onClick={() => setShowModal(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? 'Edit Event' : 'Create Event'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group-modern">
                <label>Title</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="text"
                    value={form.title} placeholder="Event title"
                    onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>Description</label>
                <textarea className="form-control-modern" style={{ paddingLeft: 14, minHeight: 100, resize: 'vertical' }}
                  value={form.description} placeholder="Describe the event..."
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group-modern">
                <label>Media (image/video)</label>
                <input className="form-control-modern" style={{ padding: '10px 14px' }} type="file" accept="image/*,video/*"
                  onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
              </div>
              <div className="modal-actions-modern">
                <button type="button" className="btn-modern" style={{ background: '#f1f5f9', color: '#334155' }}
                  onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-modern btn-modern-primary">
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageEvents;
