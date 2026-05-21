import React, { useState, useEffect } from 'react';
import { announcementsAPI } from '../../services/api';

function ManageAnnouncements() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', body: '', media: null });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try {
            const res = await announcementsAPI.getAll();
            setItems(res.data);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to fetch announcements.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        console.log('Submitting announcement, form.media:', form.media);
        fd.append('title', form.title);
        fd.append('body', form.body);
        if (form.media) fd.append('media', form.media, form.media.name || 'upload');
        try {
            if (editing) {
                await announcementsAPI.update(editing.announcement_id, fd);
                setMessage({ type: 'success', text: 'Announcement updated.' });
            } else {
                await announcementsAPI.create(fd);
                setMessage({ type: 'success', text: 'Announcement created.' });
            }
            setShowModal(false);
            setEditing(null);
            setForm({ title: '', body: '', media: null });
            fetchItems();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;
        try {
            await announcementsAPI.delete(id);
            setMessage({ type: 'success', text: 'Announcement deleted.' });
            fetchItems();
        } catch (err) {
            setMessage({ type: 'error', text: 'Delete failed.' });
        }
    };

    const openEdit = (a) => {
        setEditing(a);
        setForm({ title: a.title, body: a.body || '', media: null });
        setShowModal(true);
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ title: '', body: '', media: null });
        setShowModal(true);
    };

    const renderMedia = (mediaUrl) => {
        if (!mediaUrl) return null;
        const lower = mediaUrl.toLowerCase();
        const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
        const src = `${base}${mediaUrl}`;
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
                    <img className="media-content" src={src} alt="media" />
                </div>
            </div>
        );
    };

    return (
        <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
            <div className="page-header-modern">
                <h2>Manage Announcements</h2>
                <button className="btn-modern btn-modern-primary" onClick={openCreate}>&#x2795; Create Announcement</button>
            </div>
            {message.text && <div className={`alert-modern alert-modern-${message.type}`}>{message.text}</div>}
            {loading ? (
                <div className="loading-modern">Loading announcements...</div>
            ) : items.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📢</div>
                    <h3>No announcements</h3>
                    <p>Create your first announcement to broadcast to the site.</p>
                </div>
            ) : (
                <div className="card-modern">
                    {items.map((a) => (
                        <div key={a.announcement_id} className="media-list-card" style={{ borderBottom: '1px solid #e6eef5' }}>
                            {a.media ? (
                                <div className="media-thumb">
                                    {/* reuse renderMedia but ensure small thumbnail */}
                                    {a.media.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) ? (
                                        <video className="media-content" controls>
                                            <source src={`${(process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')}${a.media}`} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <img className="media-content" src={`${(process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')}${a.media}`} alt="media" />
                                    )}
                                </div>
                            ) : null}
                            <div style={{ flex: 1 }} className="card-body-with-media">
                                <h3 style={{ margin: 0 }}>{a.title}</h3>
                                <p style={{ color: '#475569' }}>{a.body}</p>
                                <div style={{ marginTop: 12 }}>
                                    <button className="btn-modern btn-modern-warning" style={{ marginRight: 8 }} onClick={() => openEdit(a)}>Edit</button>
                                    <button className="btn-modern btn-modern-danger" onClick={() => handleDelete(a.announcement_id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay-modern" onClick={() => setShowModal(false)}>
                    <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
                        <h3>{editing ? 'Edit Announcement' : 'Create Announcement'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group-modern">
                                <label>Title</label>
                                <div className="input-wrapper">
                                    <input className="form-control-modern" type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-group-modern">
                                <label>Body</label>
                                <textarea className="form-control-modern" style={{ minHeight: 100 }} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
                            </div>
                            <div className="form-group-modern">
                                <label>Media (image/video)</label>
                                <input className="form-control-modern" type="file" accept="image/*,video/*" onChange={(e) => setForm({ ...form, media: e.target.files[0] })} />
                            </div>
                            <div className="modal-actions-modern">
                                <button type="button" className="btn-modern" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-modern btn-modern-primary">{editing ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageAnnouncements;
