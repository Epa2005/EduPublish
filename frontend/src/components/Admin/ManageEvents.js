import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../../services/api';
import { t } from '../../i18n/i18n';

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
      setMessage({ type: 'error', text: t('admin.events.fetchFailed') });
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
        setMessage({ type: 'success', text: t('admin.events.eventUpdated') });
      } else {
        await eventsAPI.create(formData);
        setMessage({ type: 'success', text: t('admin.events.eventCreated') });
      }
      setShowModal(false);
      setEditing(null);
      setForm({ title: '', description: '', image: null });
      fetchEvents();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || t('admin.events.operationFailed') });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.events.deleteConfirm'))) return;
    try {
      await eventsAPI.delete(id);
      setMessage({ type: 'success', text: t('admin.events.deleteFailed') });
      fetchEvents();
    } catch (err) {
      setMessage({ type: 'error', text: t('admin.events.deleteFailed') });
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

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="page-header-modern">
        <h2>{t('admin.events.title')}</h2>
        <button className="btn-modern btn-modern-primary" onClick={openCreate}>
          &#x2795; {t('admin.events.create')}
        </button>
      </div>
      {message.text && (
        <div className={`alert-modern alert-modern-${message.type}`}>{message.text}</div>
      )}
      {loading ? (
        <div className="loading-modern">{t('admin.events.loading')}</div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">&#x1F4C5;</div>
          <h3>{t('admin.events.noEvents')}</h3>
          <p>{t('admin.events.noEventsDesc')}</p>
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
                    onClick={() => openEdit(event)}>{t('admin.events.editBtn')}</button>
                  <button className="btn-modern btn-modern-danger" style={{ padding: '6px 14px', fontSize: 13 }}
                    onClick={() => handleDelete(event.event_id)}>{t('admin.events.deleteBtn')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay-modern" onClick={() => setShowModal(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? t('admin.events.edit') : t('admin.events.create')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group-modern">
                <label>{t('admin.events.titleLabel')}</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="text"
                    value={form.title} placeholder={t('admin.events.titlePlaceholder')}
                    onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>{t('admin.events.descriptionLabel')}</label>
                <textarea className="form-control-modern" style={{ paddingLeft: 14, minHeight: 100, resize: 'vertical' }}
                  value={form.description} placeholder={t('admin.events.descriptionPlaceholder')}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group-modern">
                <label>{t('admin.events.mediaLabel')}</label>
                <input className="form-control-modern" style={{ padding: '10px 14px' }} type="file" accept="image/*,video/*"
                  onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
              </div>
              <div className="modal-actions-modern">
                <button type="button" className="btn-modern" style={{ background: '#f1f5f9', color: '#334155' }}
                  onClick={() => setShowModal(false)}>{t('admin.events.cancel')}</button>
                <button type="submit" className="btn-modern btn-modern-primary">
                  {editing ? t('admin.events.update') : t('admin.events.createBtn')}
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
