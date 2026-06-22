import React, { useState, useEffect } from 'react';
import api, { notesAPI } from '../../services/api';
import PreviewModal from '../Common/PreviewModal';

function TeacherNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', subject: '', file: null });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');
  const [previewType, setPreviewType] = useState('');

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const res = await notesAPI.getMyNotes();
      setNotes(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch notes.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('subject', form.subject);
    if (form.file) formData.append('file', form.file, form.file.name);
    try {
      setUploadProgress(0);
      if (editing) {
        await api.put(`/notes/${editing.note_id}`, formData, {
          onUploadProgress: (progressEvent) => {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(pct);
          }
        });
        setMessage({ type: 'success', text: 'Note updated.' });
      } else {
        await api.post('/notes', formData, {
          onUploadProgress: (progressEvent) => {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(pct);
          }
        });
        setMessage({ type: 'success', text: 'Note uploaded.' });
      }
      setShowModal(false);
      setEditing(null);
      setForm({ title: '', subject: '', file: null });
      setUploadProgress(0);
      fetchNotes();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed.' });
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await notesAPI.delete(id);
      setMessage({ type: 'success', text: 'Note deleted.' });
      fetchNotes();
    } catch (err) {
      setMessage({ type: 'error', text: 'Delete failed.' });
    }
  };

  const openEdit = (note) => {
    setEditing(note);
    setForm({ title: note.title, subject: note.subject, file: null });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', subject: '', file: null });
    setShowModal(true);
  };

  const apiBase = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="page-header-modern">
        <h2>My Notes</h2>
        <button className="btn-modern btn-modern-primary" onClick={openCreate}>
          &#x2795; Upload Note
        </button>
      </div>
      {message.text && (<div className={`alert-modern alert-modern-${message.type}`}>{message.text}</div>)}
      {loading ? (
        <div className="loading-modern">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No notes uploaded</h3>
          <p>Click "Upload Note" to share your first learning material.</p>
        </div>
      ) : (
        <div className="notes-grid-modern">
          {notes.map((note) => (
            <div className="note-card-modern" key={note.note_id}>
              <div className="note-top">
                <div className="note-thumb">{note.file_url && note.file_url.toLowerCase().endsWith('.pdf') ? '📕' : '📄'}</div>
                <div className="note-info">
                  <h4>{note.title}</h4>
                  <div className="note-meta">{note.subject}</div>
                </div>
              </div>
              <div className="note-meta">Uploaded {new Date(note.created_at).toLocaleDateString()}</div>
              <div className="note-actions" style={{ marginTop: 'auto' }}>
                <button className="btn-modern btn-modern-warning" style={{ marginRight: 8, padding: '6px 14px', fontSize: 13 }} onClick={() => openEdit(note)}>Edit</button>
                <button className="btn-modern btn-modern-danger" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => handleDelete(note.note_id)}>Delete</button>
                <a href={`${apiBase}${note.file_url}`} className="btn-download" target="_blank" rel="noopener noreferrer">&#x1F4E5; Download</a>
                <button className="btn-preview" onClick={() => { 
                  setPreviewSrc(`${apiBase}${note.file_url}`); 
                  setPreviewType(note.file_url?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : ''); 
                  setPreviewData({ title: note.title, fileName: note.file_url.split('/').pop() });
                  setPreviewOpen(true); 
                }}>Preview</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay-modern" onClick={() => setShowModal(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? 'Edit Note' : 'Upload Note'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group-modern">
                <label>Title</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="text" value={form.title} placeholder="Note title" onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>Subject</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="text" value={form.subject} placeholder="e.g. Mathematics, Science" onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>File (PDF, DOC, etc.)</label>
                <input className="form-control-modern" style={{ padding: '10px 14px' }} type="file" onChange={(e) => setForm({ ...form, file: e.target.files[0] })} required={!editing} />
              </div>
              {uploadProgress > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div className="upload-progress"><span style={{ width: `${uploadProgress}%` }} /></div>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 6 }}>{uploadProgress}%</div>
                </div>
              )}
              <div className="modal-actions-modern">
                <button type="button" className="btn-modern" style={{ background: '#f1f5f9', color: '#334155' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-modern btn-modern-primary">{editing ? 'Update' : 'Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} src={previewSrc} type={previewType} title={previewData.title} fileName={previewData.fileName} />
    </div>
  );
}

export default TeacherNotes;
